'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStaffRole } from '@/hooks/use-staff-role'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardIndexPage() {
  const router = useRouter()
  const { role, loading } = useStaffRole()

  useEffect(() => {
    if (loading) return
    if (!role) {
      router.replace('/dashboard/login')
      return
    }
    if (role === 'admin') {
      router.replace('/dashboard/admin')
    } else {
      router.replace('/dashboard/kitchen')
    }
  }, [loading, role, router])

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="size-10 text-[#d4af37]" />
    </div>
  )
}
