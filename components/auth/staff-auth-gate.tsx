'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import { Spinner } from '@/components/ui/spinner'

export function StaffAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [state, setState] = useState<'loading' | 'ok' | 'login'>('loading')

  useEffect(() => {
    if (pathname === '/dashboard/login') {
      setState('ok')
      return
    }

    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/dashboard/login')
        setState('login')
        return
      }
      setState('ok')
    })
    return () => unsub()
  }, [pathname, router])

  if (pathname === '/dashboard/login') {
    return <>{children}</>
  }

  if (state === 'loading' || state === 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505] text-[#f8f9fa]">
        <Spinner className="size-8 text-[#d4af37]" />
        <p className="text-sm text-gray-400">Checking session…</p>
      </div>
    )
  }

  return <>{children}</>
}
