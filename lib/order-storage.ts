const ORDER_ID_KEY = 'savoria_last_order_id'
const TABLE_KEY = 'savoria_table'

export function saveLastOrder(table: string, orderId: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(TABLE_KEY, table)
  sessionStorage.setItem(ORDER_ID_KEY, orderId)
}

export function readLastOrder(): { table: string; orderId: string } | null {
  if (typeof window === 'undefined') return null
  const table = sessionStorage.getItem(TABLE_KEY)
  const orderId = sessionStorage.getItem(ORDER_ID_KEY)
  if (!table || !orderId) return null
  return { table, orderId }
}
