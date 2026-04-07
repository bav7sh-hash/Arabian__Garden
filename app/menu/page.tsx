import { Suspense } from 'react'
import { MenuClient } from './menu-client'
import { Spinner } from '@/components/ui/spinner'

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Spinner className="size-10 text-[#d4af37]" />
        </div>
      }
    >
      <MenuClient />
    </Suspense>
  )
}
