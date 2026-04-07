'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { ChefHat, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { getFirebaseAuth } from '@/lib/firebase'
import { useStaffRole } from '@/hooks/use-staff-role'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard/kitchen', label: 'Kitchen', icon: ChefHat, adminOnly: false },
  { href: '/dashboard/admin', label: 'Admin', icon: LayoutDashboard, adminOnly: true },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, adminOnly: true },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { role } = useStaffRole()

  async function logout() {
    await signOut(getFirebaseAuth())
    router.replace('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f9fa] flex flex-col md:flex-row">
      <aside className="border-b md:border-b-0 md:border-r border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl md:w-64 shrink-0">
        <div className="p-6 flex md:flex-col gap-4 items-center md:items-stretch justify-between">
          <div>
            <Link href="/" className="font-serif text-xl font-bold text-[#d4af37]">
              Savoria
            </Link>
            <p className="text-xs text-gray-500 mt-1 capitalize">Staff · {role}</p>
          </div>
          <nav className="flex md:flex-col gap-1 flex-wrap justify-end">
            {links
              .filter((l) => !l.adminOnly || role === 'admin')
              .map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                    pathname === href
                      ? 'bg-[#d4af37]/15 text-[#d4af37]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5',
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
          </nav>
          <Button
            variant="outline"
            className="border-white/10 md:mt-auto"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 p-4 sm:p-8">{children}</div>
    </div>
  )
}
