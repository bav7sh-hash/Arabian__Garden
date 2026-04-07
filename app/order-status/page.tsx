import { Suspense } from 'react'
import { OrderStatusClient } from './order-status-client'
import { Spinner } from '@/components/ui/spinner'

export default function OrderStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Spinner className="size-10 text-[#d4af37]" />
        </div>
      }
    >
      <OrderStatusClient />
    </Suspense>
  )
}
