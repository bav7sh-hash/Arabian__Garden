import type { OrderStatus } from '@/lib/constants'

export type StaffRole = 'admin' | 'kitchen'

export type MenuItem = {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

export type CartLine = {
  menuId: string
  name: string
  price: number
  quantity: number
}

export type LiveOrder = {
  /** Numeric table id (matches URL ?table=5) */
  tableNumber: number
  items: CartLine[]
  totalPrice: number
  status: OrderStatus
  /** Primary sort / display time (ms) */
  createdAt: number
  /** @deprecated migrated from older writes */
  timestamp?: number
}

export type OrderHistoryDoc = LiveOrder & {
  closedAt: number
  orderId: string
}
