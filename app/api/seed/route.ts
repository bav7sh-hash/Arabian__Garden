import { NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { seedDefaults } from '@/lib/seed-server'

export async function POST() {
  const db = getAdminFirestore()
  if (!db) {
    return NextResponse.json(
      { ok: false, error: 'Server Firebase Admin is not configured.' },
      { status: 503 },
    )
  }

  try {
    await seedDefaults(db)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'Seed failed' }, { status: 500 })
  }
}
