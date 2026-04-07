'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithCustomToken } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { getFirebaseAuth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard')
      }
    })
    return () => unsub()
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = (await res.json()) as { customToken?: string; error?: string }
      if (!res.ok || !data.customToken) {
        toast.error(data.error ?? 'Login failed')
        return
      }
      await signInWithCustomToken(getFirebaseAuth(), data.customToken)
      toast.success('Welcome back')
      router.replace('/dashboard')
    } catch {
      toast.error('Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f9fa] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-white/10 bg-[#0f0f0f] shadow-2xl">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-[#d4af37]">Staff login</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to manage orders and the floor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#050505] border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#050505] border-white/10"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-[#d4af37] text-[#050505] hover:bg-[#d4af37]/90"
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-6 text-center">
              <Link href="/" className="text-[#d4af37] hover:underline">
                Back to home
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
