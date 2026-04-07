'use client'

import { usePathname } from 'next/navigation'
import { StaffAuthGate } from '@/components/auth/staff-auth-gate'
import { RoleGate } from '@/components/auth/role-gate'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <StaffAuthGate>
      <RoleGate>
        {pathname === '/dashboard/login' ? (
          children
        ) : (
          <DashboardShell>{children}</DashboardShell>
        )}
      </RoleGate>
    </StaffAuthGate>
  )
}
