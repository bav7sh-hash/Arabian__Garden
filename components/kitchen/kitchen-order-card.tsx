'use client'

import { memo, useCallback } from 'react'
import type { LiveOrder } from '@/lib/types'
import type { OrderStatus } from '@/lib/constants'
import { orderCreatedAt } from '@/lib/rtdb-paths'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export type KitchenOrderRow = {
  tableKey: string
  displayTable: string
  orderId: string
  order: LiveOrder
}

type Props = {
  row: KitchenOrderRow
  unread: boolean
  onMarkRead: (compositeKey: string) => void
  onStatusChange: (
    tableKey: string,
    orderId: string,
    status: OrderStatus,
  ) => void | Promise<void>
}

function KitchenOrderCardInner({
  row,
  unread,
  onMarkRead,
  onStatusChange,
}: Props) {
  const { tableKey, displayTable, orderId, order } = row
  const compositeKey = `${tableKey}__${orderId}`

  const markRead = useCallback(() => {
    onMarkRead(compositeKey)
  }, [compositeKey, onMarkRead])

  const t = orderCreatedAt(order)

  return (
    <Card
      className={`border-white/10 bg-[#0f0f0f] transition-[box-shadow] duration-300 ${
        unread ? 'ring-2 ring-amber-400/70 shadow-[0_0_24px_rgba(251,191,36,0.15)]' : ''
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-serif text-xl">Table {displayTable}</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            {t ? new Date(t).toLocaleString() : '—'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            className={
              order.status === 'NEW'
                ? 'bg-blue-500/20 text-blue-200'
                : order.status === 'READY'
                  ? 'bg-emerald-500/20 text-emerald-200'
                  : 'bg-amber-500/20 text-amber-100'
            }
          >
            {order.status}
          </Badge>
          {unread && (
            <Button size="sm" variant="ghost" className="h-7 text-xs text-amber-200" onClick={markRead}>
              Mark read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {order.items?.map((it) => (
          <div key={it.menuId} className="flex justify-between gap-4">
            <span className="text-gray-200">
              {it.name} <span className="text-gray-500">×{it.quantity}</span>
            </span>
            <span className="text-gray-400">₹{it.price * it.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-white/10 font-semibold">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={order.status === 'ACCEPTED' ? 'default' : 'outline'}
          className={
            order.status === 'ACCEPTED'
              ? 'bg-[#d4af37] text-[#050505]'
              : 'border-white/10'
          }
          onClick={() => void onStatusChange(tableKey, orderId, 'ACCEPTED')}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant={order.status === 'PREPARING' ? 'default' : 'outline'}
          className={
            order.status === 'PREPARING'
              ? 'bg-[#d4af37] text-[#050505]'
              : 'border-white/10'
          }
          onClick={() => void onStatusChange(tableKey, orderId, 'PREPARING')}
        >
          Preparing
        </Button>
        <Button
          size="sm"
          variant={order.status === 'READY' ? 'default' : 'outline'}
          className={
            order.status === 'READY'
              ? 'bg-[#d4af37] text-[#050505]'
              : 'border-white/10'
          }
          onClick={() => void onStatusChange(tableKey, orderId, 'READY')}
        >
          Ready
        </Button>
      </CardFooter>
    </Card>
  )
}

function orderPropsEqual(a: Props, b: Props): boolean {
  if (a.unread !== b.unread) return false
  if (a.row.tableKey !== b.row.tableKey || a.row.orderId !== b.row.orderId) return false
  const oa = a.row.order
  const ob = b.row.order
  return (
    oa.status === ob.status &&
    oa.totalPrice === ob.totalPrice &&
    orderCreatedAt(oa) === orderCreatedAt(ob) &&
    JSON.stringify(oa.items ?? []) === JSON.stringify(ob.items ?? [])
  )
}

export const KitchenOrderCard = memo(KitchenOrderCardInner, orderPropsEqual)
