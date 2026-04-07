import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin'

type Body = {
  currentPassword?: string
  currentPasswordConfirm?: string
  newPassword?: string
}

export async function POST(req: Request) {
  const auth = getAdminAuth()
  if (!auth) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 503 })
  }

  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!bearer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = await auth.verifyIdToken(bearer)
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  const body = (await req.json()) as Body
  const current = body.currentPassword ?? ''
  const current2 = body.currentPasswordConfirm ?? ''
  const nextPass = body.newPassword ?? ''

  if (!current || !current2 || !nextPass) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  if (current !== current2) {
    return NextResponse.json(
      { error: 'Current password must match in both fields' },
      { status: 400 },
    )
  }

  if (nextPass.length < 4) {
    return NextResponse.json(
      { error: 'New password must be at least 4 characters' },
      { status: 400 },
    )
  }

  const db = getAdminFirestore()
  if (!db) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 503 })
  }

  try {
    const snap = await db.doc('settings/auth').get()
    const data = snap.data() as
      | {
          users?: Record<
            string,
            { passwordHash?: string; role?: string }
          >
        }
      | undefined

    const admin = data?.users?.admin
    if (!admin?.passwordHash) {
      return NextResponse.json({ error: 'Auth not initialized' }, { status: 400 })
    }

    const valid = await bcrypt.compare(current, admin.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const newHash = bcrypt.hashSync(nextPass, 10)
    await db.doc('settings/auth').update({
      'users.admin.passwordHash': newHash,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Could not update password' }, { status: 500 })
  }
}
