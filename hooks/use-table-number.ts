'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { normalizeTableNumberInput } from '@/lib/rtdb-paths'

const STORAGE_KEY = 'savoria_table'

/** Normalized table number for display and RTDB (matches ?table=5) */
export function useTableNumber(): string {
  const search = useSearchParams()
  const fromQuery = search.get('table') ?? search.get('t') ?? search.get('tableNumber')
  const [stored, setStored] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setStored(sessionStorage.getItem(STORAGE_KEY))
  }, [])

  return useMemo(() => {
    const raw = fromQuery?.trim() || stored || '1'
    const n = normalizeTableNumberInput(raw)
    const s = String(n)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, s)
    }
    return s
  }, [fromQuery, stored])
}
