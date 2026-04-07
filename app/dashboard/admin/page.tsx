'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { addDoc, collection, doc, getDocs, onSnapshot } from 'firebase/firestore'
import { get, onValue, ref, remove, set } from 'firebase/database'
import { Printer, Download, DoorClosed } from 'lucide-react'
import { toast } from 'sonner'
import { getFirestoreDb, getRealtimeDb } from '@/lib/firebase'
import type { LiveOrder } from '@/lib/types'
import { liveTableFolderKey, normalizeTableNumberInput, parseDisplayTableNumber } from '@/lib/rtdb-paths'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

const TABLE_RANGE = Array.from({ length: 50 }, (_, i) => String(i + 1))

function escapeCsv(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`
  return v
}

export default function AdminPage() {
  const [totals, setTotals] = useState<Record<string, number>>({})
  const [restaurantName, setRestaurantName] = useState('Savoria')
  const [printTable, setPrintTable] = useState<string | null>(null)
  const [printLines, setPrintLines] = useState<{ name: string; qty: number; line: number }[]>([])
  const [printTotal, setPrintTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const db = getFirestoreDb()
      const unsub = onSnapshot(
        doc(db, 'settings', 'app'),
        (snap) => {
          try {
            const n = snap.data()?.restaurantName as string | undefined
            if (n) setRestaurantName(n)
          } catch (e) {
            console.error(e)
          }
        },
        (err) => console.error(err),
      )
      return () => unsub()
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    const rtdb = getRealtimeDb()
    const unsub = onValue(
      ref(rtdb, 'liveOrders'),
      (snap) => {
        try {
          const next: Record<string, number> = {}
          snap.forEach((tableSnap) => {
            const tableKey = tableSnap.key ?? ''
            const displayNum = parseDisplayTableNumber(tableKey)
            let sum = 0
            tableSnap.forEach((orderSnap) => {
              const o = orderSnap.val() as LiveOrder | null
              if (o?.totalPrice != null) sum += o.totalPrice
            })
            next[displayNum] = sum
          })
          setTotals(next)
          setLoading(false)
        } catch (e) {
          console.error(e)
          toast.error('Could not load table totals')
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        toast.error('Realtime connection error')
        setLoading(false)
      },
    )
    return () => unsub()
  }, [])

  const tableRows = useMemo(() => {
    const keys = new Set([...TABLE_RANGE, ...Object.keys(totals)])
    return Array.from(keys)
      .map((t) => Number(t))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => a - b)
      .map((n) => String(n))
  }, [totals])

  const loadPrint = useCallback(async (tableNumber: string) => {
    try {
      const rtdb = getRealtimeDb()
      const folder = liveTableFolderKey(tableNumber)
      const snap = await get(ref(rtdb, `liveOrders/${folder}`))
      if (!snap.exists()) {
        toast.error('No live orders for this table')
        return
      }
      const val = snap.val() as Record<string, LiveOrder>
      const lines: { name: string; qty: number; line: number }[] = []
      let total = 0
      Object.values(val).forEach((order) => {
        order.items?.forEach((it) => {
          const line = it.price * it.quantity
          total += line
          lines.push({ name: it.name, qty: it.quantity, line })
        })
      })
      setPrintLines(lines)
      setPrintTotal(total)
      setPrintTable(tableNumber)
    } catch (e) {
      console.error(e)
      toast.error('Could not load bill')
    }
  }, [])

  const runPrint = useCallback(() => {
    window.print()
  }, [])

  const closeTable = useCallback(async (tableNumber: string) => {
    try {
      const rtdb = getRealtimeDb()
      const db = getFirestoreDb()
      const folder = liveTableFolderKey(tableNumber)
      const snap = await get(ref(rtdb, `liveOrders/${folder}`))
      if (!snap.exists()) {
        toast.message('Table already clear')
        return
      }
      const val = snap.val() as Record<string, LiveOrder>
      const num = normalizeTableNumberInput(tableNumber)
      for (const [orderId, order] of Object.entries(val)) {
        await addDoc(collection(db, 'orderHistory'), {
          ...order,
          orderId,
          tableNumber: num,
          closedAt: Date.now(),
        })
      }
      await remove(ref(rtdb, `liveOrders/${folder}`))
      await set(ref(rtdb, `tableStatus/${folder}`), {
        status: 'available',
        closedAt: Date.now(),
      })
      toast.success(`Table ${tableNumber} closed and archived`)
    } catch (e) {
      console.error(e)
      toast.error('Could not close table')
    }
  }, [])

  const exportCsv = useCallback(async () => {
    try {
      const db = getFirestoreDb()
      const snap = await getDocs(collection(db, 'orderHistory'))
      const rows: string[] = [
        ['closedAt', 'tableNumber', 'orderId', 'totalPrice', 'status', 'items'].join(','),
      ]
      snap.forEach((d) => {
        const x = d.data() as Record<string, unknown>
        const items = JSON.stringify(x.items ?? [])
        rows.push(
          [
            escapeCsv(String(x.closedAt ?? '')),
            escapeCsv(String(x.tableNumber ?? '')),
            escapeCsv(String(x.orderId ?? d.id)),
            escapeCsv(String(x.totalPrice ?? '')),
            escapeCsv(String(x.status ?? '')),
            escapeCsv(items),
          ].join(','),
        )
      })
      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `order-history-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export started')
    } catch (e) {
      console.error(e)
      toast.error('Export failed')
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <Spinner className="size-10 text-[#d4af37]" />
        <p className="text-sm text-gray-500">Loading table data…</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#d4af37]">Admin</h1>
          <p className="text-gray-400 mt-1">Sums all orders under each liveOrders/table_N node.</p>
        </div>
        <Button
          variant="outline"
          className="border-white/10 self-start"
          onClick={() => void exportCsv()}
        >
          <Download className="size-4" />
          Export data
        </Button>
      </div>

      <Card className="border-white/10 bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Table overview</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead>Table</TableHead>
                <TableHead className="text-right">Total bill</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((t) => (
                <TableRow key={t} className="border-white/10">
                  <TableCell className="font-medium">Table {t}</TableCell>
                  <TableCell className="text-right">₹{totals[t] ?? 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10"
                      onClick={() => void loadPrint(t)}
                    >
                      <Printer className="size-4" />
                      Print bill
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
                      onClick={() => void closeTable(t)}
                    >
                      <DoorClosed className="size-4" />
                      Close table
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-gray-500"
      >
        Totals sum every order under liveOrders/table_N for that table.
      </motion.p>

      <Dialog open={printTable !== null} onOpenChange={(o) => !o && setPrintTable(null)}>
        <DialogContent className="max-w-md border-white/10 bg-white text-black print:shadow-none print:border-0">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{restaurantName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 print:block">
            <p className="text-sm">Table {printTable}</p>
            <ul className="text-sm space-y-1">
              {printLines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>
                    {l.name} × {l.qty}
                  </span>
                  <span>₹{l.line}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{printTotal}</span>
            </div>
            <Button className="w-full print:hidden" onClick={runPrint}>
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
