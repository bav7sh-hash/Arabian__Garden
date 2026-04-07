'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { onValue, ref, remove, update, type DataSnapshot } from 'firebase/database'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import { getRealtimeDb } from '@/lib/firebase'
import type { LiveOrder } from '@/lib/types'
import type { OrderStatus } from '@/lib/constants'
import { parseDisplayTableNumber, orderCreatedAt } from '@/lib/rtdb-paths'
import { playOrderSound } from '@/lib/play-order-sound'
import { KitchenOrderCard, type KitchenOrderRow } from '@/components/kitchen/kitchen-order-card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

function flattenLiveOrders(snap: DataSnapshot): KitchenOrderRow[] {
  const next: KitchenOrderRow[] = []
  snap.forEach((tableSnap) => {
    const tableKey = tableSnap.key ?? ''
    tableSnap.forEach((orderSnap) => {
      const orderId = orderSnap.key ?? ''
      const val = orderSnap.val() as LiveOrder | null
      if (!val) return
      next.push({
        tableKey,
        displayTable: parseDisplayTableNumber(tableKey),
        orderId,
        order: val,
      })
    })
  })
  next.sort((a, b) => orderCreatedAt(b.order) - orderCreatedAt(a.order))
  return next
}

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrderRow[]>([])
  const [calls, setCalls] = useState<Record<string, { timestamp?: number; message?: string }>>({})
  const [loading, setLoading] = useState(true)
  const [unreadKeys, setUnreadKeys] = useState<Set<string>>(() => new Set())

  const seenOrderKeys = useRef<Set<string>>(new Set())
  const bootstrapped = useRef(false)

  useEffect(() => {
    const rtdb = getRealtimeDb()
    const unsubOrders = onValue(
      ref(rtdb, 'liveOrders'),
      (snap) => {
        try {
          const next = flattenLiveOrders(snap)
          setOrders(next)
          setLoading(false)

          const keys = new Set(next.map((r) => `${r.tableKey}__${r.orderId}`))
          if (!bootstrapped.current) {
            keys.forEach((k) => seenOrderKeys.current.add(k))
            bootstrapped.current = true
            return
          }
          for (const k of keys) {
            if (!seenOrderKeys.current.has(k)) {
              seenOrderKeys.current.add(k)
              playOrderSound()
              setUnreadKeys((prev) => new Set(prev).add(k))
            }
          }
        } catch (e) {
          console.error(e)
          toast.error('Could not load orders')
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        toast.error('Realtime connection error')
        setLoading(false)
      },
    )

    const unsubCalls = onValue(
      ref(rtdb, 'waiterCalls'),
      (snap) => {
        try {
          setCalls((snap.val() as typeof calls) ?? {})
        } catch (e) {
          console.error(e)
        }
      },
      (err) => console.error(err),
    )

    return () => {
      unsubOrders()
      unsubCalls()
    }
  }, [])

  const callEntries = useMemo(() => Object.entries(calls), [calls])

  const markRead = useCallback((compositeKey: string) => {
    setUnreadKeys((prev) => {
      const n = new Set(prev)
      n.delete(compositeKey)
      return n
    })
  }, [])

  const setStatus = useCallback(async (tableKey: string, orderId: string, status: OrderStatus) => {
    try {
      const rtdb = getRealtimeDb()
      await update(ref(rtdb, `liveOrders/${tableKey}/${orderId}`), { status })
    } catch (e) {
      console.error(e)
      toast.error('Could not update status')
    }
  }, [])

  const dismissCall = useCallback(async (tableKey: string) => {
    try {
      const rtdb = getRealtimeDb()
      await remove(ref(rtdb, `waiterCalls/${tableKey}`))
    } catch (e) {
      console.error(e)
      toast.error('Could not dismiss')
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner className="size-10 text-[#d4af37]" />
        <p className="text-sm text-gray-500">Loading live orders…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#d4af37]">Kitchen</h1>
        <p className="text-gray-400 mt-1">
          One listener on <code className="text-xs text-gray-500">liveOrders</code> — new tickets play a chime and
          highlight until marked read.
        </p>
      </div>

      {callEntries.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-amber-200 font-medium mb-3">
            <Bell className="size-5" />
            Waiter calls
          </div>
          <div className="flex flex-wrap gap-2">
            {callEntries.map(([tableKey, info]) => (
              <div
                key={tableKey}
                className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 text-sm"
              >
                <span>Table {parseDisplayTableNumber(tableKey)}</span>
                {info?.timestamp && (
                  <span className="text-gray-500 text-xs">
                    {new Date(info.timestamp).toLocaleTimeString()}
                  </span>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-xs text-amber-200"
                  onClick={() => void dismissCall(tableKey)}
                >
                  Dismiss
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {orders.length === 0 ? (
          <p className="text-gray-500">No active orders.</p>
        ) : (
          orders.map((row) => {
            const compositeKey = `${row.tableKey}__${row.orderId}`
            return (
              <KitchenOrderCard
                key={compositeKey}
                row={row}
                unread={unreadKeys.has(compositeKey)}
                onMarkRead={markRead}
                onStatusChange={setStatus}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
