import type { Firestore } from 'firebase-admin/firestore'
import bcrypt from 'bcryptjs'
import { SEED_MENU_ITEMS } from '@/lib/seed-data'

export async function seedDefaults(db: Firestore) {
  const menuSnap = await db.collection('menu').limit(1).get()
  if (menuSnap.empty) {
    const batch = db.batch()
    for (const item of SEED_MENU_ITEMS) {
      const ref = db.collection('menu').doc()
      batch.set(ref, item)
    }
    await batch.commit()
  }

  const authRef = db.doc('settings/auth')
  const authSnap = await authRef.get()
  if (!authSnap.exists) {
    const hash = bcrypt.hashSync('1234', 10)
    await authRef.set({
      users: {
        admin: { passwordHash: hash, role: 'admin' },
        kitchen: { passwordHash: hash, role: 'kitchen' },
      },
    })
  }

  const appRef = db.doc('settings/app')
  const appSnap = await appRef.get()
  if (!appSnap.exists) {
    await appRef.set({
      restaurantName: 'Savoria',
      reviewLink: process.env.NEXT_PUBLIC_REVIEW_LINK ?? 'https://www.google.com/maps',
    })
  }
}
