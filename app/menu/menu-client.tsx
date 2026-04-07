'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { signInAnonymously } from 'firebase/auth'
import { collection, onSnapshot, query, writeBatch, doc } from 'firebase/firestore'
import { push, ref, set } from 'firebase/database'
import { Bell, Minus, Plus, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { getFirebaseAuth, getFirestoreDb, getRealtimeDb } from '@/lib/firebase'
import { useTableNumber } from '@/hooks/use-table-number'
import { useNetworkStatus } from '@/hooks/use-network-status'
import type { CartLine, MenuItem } from '@/lib/types'
import { SEED_MENU_ITEMS } from '@/lib/seed-data'
import { saveLastOrder } from '@/lib/order-storage'
import {
  dequeuePendingOrder,
  enqueuePendingOrder,
  getPendingOrders,
} from '@/lib/offline-order-queue'
import { liveTableFolderKey, normalizeTableNumberInput } from '@/lib/rtdb-paths'
import { ReviewPopup } from '@/components/review-popup'
import { CustomerNetworkBar } from '@/components/menu/customer-network-bar'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'

async function seedMenuClient() {
  const db = getFirestoreDb()
  const batch = writeBatch(db)
  for (const item of SEED_MENU_ITEMS) {
    const r = doc(collection(db, 'menu'))
    batch.set(r, item)
  }
  await batch.commit()
}

export function MenuClient() {
  const tableNumber = useTableNumber()
  const online = useNetworkStatus()
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Record<string, CartLine>>({})
  const [reviewOpen, setReviewOpen] = useState(false)
  const [statusHref, setStatusHref] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const seedAttempted = useRef(false)
  const lastSuccessSubmitAt = useRef(0)

  useEffect(() => {
    const auth = getFirebaseAuth()
    signInAnonymously(auth)
      .then(() => setAuthReady(true))
      .catch(() => {
        toast.error('Could not start session. Check Firebase Auth (Anonymous).')
        setAuthReady(true)
      })
  }, [])

  const flushPendingOrders = useCallback(async () => {
    if (!authReady || typeof navigator === 'undefined' || !navigator.onLine) return
    const pending = getPendingOrders()
    if (pending.length === 0) return
    const rtdb = getRealtimeDb()
    for (const p of pending) {
      try {
        const folder = liveTableFolderKey(p.payload.tableNumber)
        const newRef = push(ref(rtdb, `liveOrders/${folder}`))
        const orderId = newRef.key
        if (!orderId) continue
        await set(newRef, {
          tableNumber: p.payload.tableNumber,
          items: p.payload.items,
          totalPrice: p.payload.totalPrice,
          status: 'NEW',
          createdAt: Date.now(),
        })
        dequeuePendingOrder(p.localId)
        toast.success('Queued order sent')
      } catch (e) {
        console.error(e)
        break
      }
    }
  }, [authReady])

  useEffect(() => {
    const onUp = () => void flushPendingOrders()
    window.addEventListener('online', onUp)
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      void flushPendingOrders()
    }
    return () => window.removeEventListener('online', onUp)
  }, [flushPendingOrders])

  useEffect(() => {
    const db = getFirestoreDb()
    const q = query(collection(db, 'menu'))
    const unsub = onSnapshot(
      q,
      async (snap) => {
        try {
          const rows: MenuItem[] = []
          snap.forEach((d) => {
            rows.push({ id: d.id, ...(d.data() as Omit<MenuItem, 'id'>) })
          })
          rows.sort((a, b) => a.name.localeCompare(b.name))
          if (rows.length === 0) {
            if (!seedAttempted.current) {
              seedAttempted.current = true
              try {
                const res = await fetch('/api/seed', { method: 'POST' })
                if (!res.ok) {
                  await seedMenuClient()
                }
              } catch {
                try {
                  await seedMenuClient()
                } catch {
                  toast.error('Could not seed menu. Configure Firestore rules or Admin SDK.')
                }
              }
              return
            }
            setMenu([])
            setLoading(false)
            return
          }
          setMenu(rows)
          setLoading(false)
        } catch (e) {
          console.error(e)
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        setLoading(false)
      },
    )
    return () => unsub()
  }, [])

  const categories = useMemo(() => {
    const s = new Set<string>()
    menu.forEach((m) => s.add(m.category || 'General'))
    return Array.from(s)
  }, [menu])

  const addLine = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const cur = prev[item.id]
      if (cur) {
        return {
          ...prev,
          [item.id]: { ...cur, quantity: cur.quantity + 1 },
        }
      }
      return {
        ...prev,
        [item.id]: {
          menuId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      }
    })
  }, [])

  const decLine = useCallback((menuId: string) => {
    setCart((prev) => {
      const cur = prev[menuId]
      if (!cur) return prev
      if (cur.quantity <= 1) {
        const next = { ...prev }
        delete next[menuId]
        return next
      }
      return { ...prev, [menuId]: { ...cur, quantity: cur.quantity - 1 } }
    })
  }, [])

  const total = useMemo(() => {
    return Object.values(cart).reduce((a, l) => a + l.price * l.quantity, 0)
  }, [cart])

  const placeOrder = useCallback(async () => {
    const lines = Object.values(cart)
    if (!lines.length) {
      toast.error('Your cart is empty')
      return
    }
    if (!authReady) {
      toast.error('Connecting… please try again in a moment.')
      return
    }
    const now = Date.now()
    if (now - lastSuccessSubmitAt.current < 5000) {
      toast.error('Please wait a few seconds between orders.')
      return
    }
    if (submitting) return

    setSubmitting(true)
    const tableNum = normalizeTableNumberInput(tableNumber)
    const folder = liveTableFolderKey(tableNum)
    const payload = { tableNumber: tableNum, items: lines, totalPrice: total }

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        enqueuePendingOrder(payload)
        toast.success('Offline — order saved. We will send it when you are back online.')
        setCart({})
        setSubmitting(false)
        return
      }

      const rtdb = getRealtimeDb()
      const newRef = push(ref(rtdb, `liveOrders/${folder}`))
      const orderId = newRef.key
      if (!orderId) {
        throw new Error('Could not allocate order id')
      }
      await set(newRef, {
        tableNumber: tableNum,
        items: lines,
        totalPrice: total,
        status: 'NEW',
        createdAt: Date.now(),
      })
      lastSuccessSubmitAt.current = Date.now()
      saveLastOrder(String(tableNum), orderId)
      setCart({})
      setStatusHref(
        `/order-status?table=${encodeURIComponent(String(tableNum))}&order=${encodeURIComponent(orderId)}`,
      )
      setReviewOpen(true)
      toast.success('Order placed!')
    } catch (e) {
      console.error(e)
      try {
        enqueuePendingOrder(payload)
        toast.message('Could not send — saved to retry when connection is stable.')
      } catch {
        toast.error('Could not place order. Try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }, [authReady, cart, submitting, tableNumber, total])

  const callWaiter = useCallback(async () => {
    try {
      const rtdb = getRealtimeDb()
      const key = liveTableFolderKey(normalizeTableNumberInput(tableNumber))
      await set(ref(rtdb, `waiterCalls/${key}`), {
        timestamp: Date.now(),
        message: 'Assistance requested',
      })
      toast.message('Waiter has been notified.')
    } catch (e) {
      console.error(e)
      toast.error('Could not send request')
    }
  }, [tableNumber])

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f9fa] selection:bg-[#d4af37] selection:text-[#050505]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full" />
      </div>

      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/images/logo.jpg"
              alt=""
              className="h-10 sm:h-12 rounded-lg border border-white/10 shrink-0"
              width={48}
              height={48}
            />
            <div className="min-w-0">
              <p className="font-serif text-lg sm:text-2xl font-bold tracking-tight truncate">
                Savoria
              </p>
              <p className="text-xs text-gray-500 truncate">Table {tableNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <CustomerNetworkBar />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-white/10 bg-white/5 hover:bg-white/10"
              onClick={callWaiter}
              aria-label="Call waiter"
            >
              <Bell className="size-5 text-[#d4af37]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/5 hover:bg-white/10 hidden sm:inline-flex"
              asChild
            >
              <Link href={`/order-status?table=${encodeURIComponent(tableNumber)}`}>
                Order status
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-[#d4af37] text-[#050505] hover:bg-[#d4af37]/90">
                  <ShoppingBag className="size-4" />
                  Cart
                  {Object.keys(cart).length > 0 && (
                    <Badge className="ml-1 bg-[#050505] text-[#d4af37]">
                      {Object.values(cart).reduce((a, l) => a + l.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#0f0f0f] border-white/10 text-[#f8f9fa] w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="font-serif">Your order</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {Object.values(cart).length === 0 ? (
                    <p className="text-sm text-gray-500">No items yet.</p>
                  ) : (
                    Object.values(cart).map((line) => (
                      <div
                        key={line.menuId}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{line.name}</p>
                          <p className="text-gray-500">
                            ₹{line.price} × {line.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="border-white/10"
                            onClick={() => decLine(line.menuId)}
                            disabled={submitting}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="w-6 text-center">{line.quantity}</span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="border-white/10"
                            onClick={() =>
                              setCart((prev) => {
                                const cur = prev[line.menuId]
                                if (!cur) return prev
                                return {
                                  ...prev,
                                  [line.menuId]: {
                                    ...cur,
                                    quantity: cur.quantity + 1,
                                  },
                                }
                              })
                            }
                            disabled={submitting}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Separator className="bg-white/10" />
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <Button
                    className="w-full bg-[#d4af37] text-[#050505] hover:bg-[#d4af37]/90 disabled:opacity-60"
                    onClick={() => void placeOrder()}
                    disabled={submitting || Object.keys(cart).length === 0}
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Spinner className="size-4 text-[#050505]" />
                        Placing…
                      </span>
                    ) : (
                      'Place order'
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-2">Menu</h1>
            <p className="text-gray-400 max-w-xl">
              Browse dishes and add them to your cart. Your kitchen receives orders instantly.
            </p>
          </div>
          <Button variant="outline" className="border-white/10 sm:hidden self-start" asChild>
            <Link href={`/order-status?table=${encodeURIComponent(tableNumber)}`}>
              Track order
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner className="size-10 text-[#d4af37]" />
          </div>
        ) : (
          categories.map((cat) => (
            <section key={cat} className="mb-14">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-[#d4af37]">{cat}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu
                  .filter((m) => (m.category || 'General') === cat)
                  .map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                    >
                      <Card className="overflow-hidden border-white/10 bg-[#0f0f0f] hover:border-[#d4af37]/40 transition-colors">
                        <div className="relative aspect-[4/3] w-full bg-black/40">
                          <Image
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="font-serif text-xl">{item.name}</CardTitle>
                            <Badge variant="secondary" className="shrink-0 bg-white/10">
                              ₹{item.price}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-400 line-clamp-3">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <Button
                            className="w-full bg-[#d4af37] text-[#050505] hover:bg-[#d4af37]/90"
                            onClick={() => addLine(item)}
                            disabled={submitting}
                          >
                            Add to cart
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </section>
          ))
        )}
      </main>

      <ReviewPopup
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        orderStatusHref={statusHref}
      />
    </div>
  )
}
