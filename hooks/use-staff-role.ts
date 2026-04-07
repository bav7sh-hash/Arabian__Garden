'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'
import type { StaffRole } from '@/lib/types'

export function useStaffRole(): { role: StaffRole | null; loading: boolean } {
  const [role, setRole] = useState<StaffRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }
      const token = await user.getIdTokenResult(true)
      const r = token.claims.role as string | undefined
      if (r === 'admin' || r === 'kitchen') {
        setRole(r)
      } else {
        setRole('kitchen')
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return { role, loading }
}
