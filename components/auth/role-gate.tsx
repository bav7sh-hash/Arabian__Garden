'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useStaffRole } from '@/hooks/use-staff-role'
import { Spinner } from '@/components/ui/spinner'

export function RoleGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { role, loading } = useStaffRole()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/dashboard/login') return
    if (loading || !role) return
    const isAdminOnly =
      pathname?.startsWith('/dashboard/admin') ||
      pathname?.startsWith('/dashboard/settings')
    if (isAdminOnly && role !== 'admin') {
      router.replace('/dashboard/kitchen')
    }
  }, [loading, role, pathname, router])

  if (pathname === '/dashboard/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#050505] text-[#f8f9fa]">
        <Spinner className="size-8 text-[#d4af37]" />
      </div>
    )
  }

  const isAdminOnly =
    pathname?.startsWith('/dashboard/admin') ||
    pathname?.startsWith('/dashboard/settings')
  if (isAdminOnly && role !== 'admin') {
    return null
  }

  return <>{children}</>
}
