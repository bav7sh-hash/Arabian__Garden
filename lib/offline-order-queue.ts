import type { CartLine } from '@/lib/types'

const STORAGE_KEY = 'savoria_pending_orders_v1'

export type PendingOrderPayload = {
  tableNumber: number
  items: CartLine[]
  totalPrice: number
}

export type QueuedOrder = {
  localId: string
  payload: PendingOrderPayload
  queuedAt: number
}

function readQueue(): QueuedOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as QueuedOrder[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeQueue(q: QueuedOrder[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(q))
}

export function enqueuePendingOrder(payload: PendingOrderPayload): string {
  const localId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `ord_${Date.now()}_${Math.random().toString(36).slice(2)}`
  const q = readQueue()
  q.push({ localId, payload, queuedAt: Date.now() })
  writeQueue(q)
  return localId
}

export function dequeuePendingOrder(localId: string) {
  const q = readQueue().filter((x) => x.localId !== localId)
  writeQueue(q)
}

export function getPendingOrders(): QueuedOrder[] {
  return readQueue()
}

export function clearPendingQueue() {
  writeQueue([])
}
