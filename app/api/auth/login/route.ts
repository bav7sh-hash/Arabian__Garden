import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'
import { seedDefaults } from '@/lib/seed-server'

type Body = { username?: string; password?: string }

export async function POST(req: Request) {
  const body = (await req.json()) as Body
  const username = body.username?.trim().toLowerCase()
  const password = body.password ?? ''

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const db = getAdminFirestore()
  const auth = getAdminAuth()

  if (!db || !auth) {
    return NextResponse.json(
      {
        error:
          'Server is missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON.',
      },
      { status: 503 },
    )
  }

  try {
    const snap = await db.doc('settings/auth').get()
    if (!snap.exists) {
      await seedDefaults(db)
    }
    const data = (await db.doc('settings/auth').get()).data() as
      | {
          users?: Record<
            string,
            { passwordHash?: string; role?: 'admin' | 'kitchen' }
          >
        }
      | undefined

    const userEntry = data?.users?.[username]
    if (!userEntry?.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, userEntry.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const role = userEntry.role ?? (username === 'admin' ? 'admin' : 'kitchen')
    const uid = username === 'admin' ? 'staff_admin' : 'staff_kitchen'

    const customToken = await auth.createCustomToken(uid, {
      role,
      username,
    })

    return NextResponse.json({ customToken })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
