import type { LiveOrder } from '@/lib/types'

/** RTDB folder key: liveOrders/table_5/orderId */
export function liveTableFolderKey(tableInput: string | number): string {
  const n =
    typeof tableInput === 'string'
      ? parseInt(String(tableInput).replace(/\D/g, '') || '1', 10)
      : tableInput
  if (Number.isNaN(n) || n < 1) return 'table_1'
  return `table_${n}`
}

/** Display label "5" from folder key "table_5" */
export function parseDisplayTableNumber(folderKey: string): string {
  const m = /^table_(\d+)$/.exec(folderKey)
  if (m) return m[1]
  return folderKey.replace(/^table_/, '') || folderKey
}

export function normalizeTableNumberInput(raw: string | null | undefined): number {
  if (raw == null || raw === '') return 1
  const n = parseInt(String(raw).replace(/\D/g, '') || '1', 10)
  if (Number.isNaN(n) || n < 1) return 1
  return n
}

export function orderCreatedAt(o: LiveOrder): number {
  return o.createdAt ?? (o as { timestamp?: number }).timestamp ?? 0
}
