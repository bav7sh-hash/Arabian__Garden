/** Replace with your Google review URL via NEXT_PUBLIC_REVIEW_LINK */
export const REVIEW_LINK =
  process.env.NEXT_PUBLIC_REVIEW_LINK ?? 'https://www.google.com/maps'

export const ORDER_STATUSES = [
  'NEW',
  'ACCEPTED',
  'PREPARING',
  'READY',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
