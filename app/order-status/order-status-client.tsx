'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { onValue, ref } from 'firebase/database'
import { signInAnonymously } from 'firebase/auth'
import { getFirebaseAuth, getRealtimeDb } from '@/lib/firebase'
import { liveTableFolderKey, normalizeTableNumberInput } from '@/lib/rtdb-paths'
import { readLastOrder } from '@/lib/order-storage'
import type { LiveOrder } from '@/lib/types'
import type { OrderStatus } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'NEW', label: 'Received' },
  { status: 'ACCEPTED', label: 'Accepted' },
  { status: 'PREPARING', label: 'Preparing' },
  { status: 'READY', label: 'Ready' },
]

function stepIndex(status: OrderStatus) {
  return STEPS.findIndex((s) => s.status === status)
}

export function OrderStatusClient() {
  const search = useSearchParams()
  const tableQ = search.get('table') ?? search.get('t')
  const orderQ = search.get('order') ?? search.get('orderId')
  const [order, setOrder] = useState<LiveOrder | null>(null)
  const [missing, setMissing] = useState(false)

  const table = tableQ ?? readLastOrder()?.table
  const orderId = orderQ ?? readLastOrder()?.orderId

  useEffect(() => {
    const auth = getFirebaseAuth()
    signInAnonymously(auth).catch(() => {})
  }, [])

  useEffect(() => {
    if (!table || !orderId) {
      setMissing(true)
      return
    }
    const rtdb = getRealtimeDb()
    const folder = liveTableFolderKey(normalizeTableNumberInput(table))
    const r = ref(rtdb, `liveOrders/${folder}/${orderId}`)
    const unsub = onValue(r, (snap) => {
      if (!snap.exists()) {
        setOrder(null)
        setMissing(true)
        return
      }
      setOrder(snap.val() as LiveOrder)
      setMissing(false)
    })
    return () => unsub()
  }, [table, orderId])

  const progress = useMemo(() => {
    if (!order) return 0
    const st = (order.status ?? 'NEW') as OrderStatus
    const idx = stepIndex(st)
    if (idx < 0) return 0
    return Math.min(100, ((idx + 1) / STEPS.length) * 100)
  }, [order])

  if (!table || !orderId) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f8f9fa] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-gray-400 text-center">
          No order context. Place an order from the menu or open the link from your table QR.
        </p>
        <Button asChild className="bg-[#d4af37] text-[#050505]">
          <Link href="/menu">Go to menu</Link>
        </Button>
      </div>
    )
  }

  if (!order && !missing) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Spinner className="size-10 text-[#d4af37]" />
      </div>
    )
  }

  if (missing || !order) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f8f9fa] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-gray-400 text-center">
          This order is no longer live. It may have been completed.
        </p>
        <Button asChild variant="outline" className="border-white/10">
          <Link href={`/menu?table=${encodeURIComponent(table)}`}>Back to menu</Link>
        </Button>
      </div>
    )
  }

  const active = stepIndex((order.status ?? 'NEW') as OrderStatus)

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f9fa] selection:bg-[#d4af37] selection:text-[#050505]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full" />
      </div>
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Order status</p>
            <h1 className="font-serif text-2xl font-bold">Table {table}</h1>
          </div>
          <Badge className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
            {(order.status ?? 'NEW') as OrderStatus}
          </Badge>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10 relative z-10">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Progress</p>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
        <div className="grid gap-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.status}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border px-4 py-3 flex items-center justify-between ${
                i <= active
                  ? 'border-[#d4af37]/40 bg-[#d4af37]/10'
                  : 'border-white/10 bg-[#0f0f0f]/60'
              }`}
            >
              <span className="font-medium">{s.label}</span>
              {i < active ? (
                <span className="text-xs text-emerald-400">Done</span>
              ) : i === active ? (
                <span className="text-xs text-[#d4af37]">Current</span>
              ) : (
                <span className="text-xs text-gray-500">Pending</span>
              )}
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
          <p className="text-sm text-gray-400 mb-4">Items</p>
          <ul className="space-y-2 text-sm">
            {order.items?.map((it) => (
              <li key={it.menuId} className="flex justify-between gap-4">
                <span>
                  {it.name} <span className="text-gray-500">×{it.quantity}</span>
                </span>
                <span className="text-gray-400">₹{it.price * it.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold mt-4 pt-4 border-t border-white/10">
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>
        <Button asChild variant="outline" className="border-white/10 w-full sm:w-auto">
          <Link href={`/menu?table=${encodeURIComponent(table)}`}>Order more</Link>
        </Button>
      </main>
    </div>
  )
}
