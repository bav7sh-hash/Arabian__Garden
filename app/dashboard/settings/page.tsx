'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { getFirebaseAuth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardSettingsPage() {
  const [current, setCurrent] = useState('')
  const [current2, setCurrent2] = useState('')
  const [nextPass, setNextPass] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const user = getFirebaseAuth().currentUser
      if (!user) {
        toast.error('Not signed in')
        return
      }
      const idToken = await user.getIdToken()
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          currentPassword: current,
          currentPasswordConfirm: current2,
          newPassword: nextPass,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) {
        toast.error(data.error ?? 'Could not update password')
        return
      }
      toast.success('Password updated')
      setCurrent('')
      setCurrent2('')
      setNextPass('')
    } catch {
      toast.error('Request failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#d4af37]">Settings</h1>
        <p className="text-gray-400 mt-1">Change the admin password.</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="border-white/10 bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Security</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your current password twice, then choose a new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="c1">Current password</Label>
                <Input
                  id="c1"
                  type="password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="bg-[#050505] border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c2">Confirm current password</Label>
                <Input
                  id="c2"
                  type="password"
                  value={current2}
                  onChange={(e) => setCurrent2(e.target.value)}
                  className="bg-[#050505] border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="n">New password</Label>
                <Input
                  id="n"
                  type="password"
                  value={nextPass}
                  onChange={(e) => setNextPass(e.target.value)}
                  className="bg-[#050505] border-white/10"
                  required
                  minLength={4}
                />
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="bg-[#d4af37] text-[#050505] hover:bg-[#d4af37]/90"
              >
                {busy ? 'Saving…' : 'Update password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
