import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp: App | null = null

function getDatabaseUrl(): string {
  return (
    process.env.FIREBASE_DATABASE_URL ??
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
    'https://restaurant-d3044-default-rtdb.firebaseio.com'
  )
}

export function getFirebaseAdminApp(): App | null {
  if (adminApp) return adminApp
  if (getApps().length) {
    adminApp = getApps()[0]!
    return adminApp
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!json) {
    return null
  }

  try {
    const credentials = JSON.parse(json) as Record<string, unknown>
    adminApp = initializeApp({
      credential: cert(credentials as Parameters<typeof cert>[0]),
      databaseURL: getDatabaseUrl(),
    })
    return adminApp
  } catch {
    return null
  }
}

export function getAdminAuth() {
  const app = getFirebaseAdminApp()
  if (!app) return null
  return getAuth(app)
}

export function getAdminFirestore() {
  const app = getFirebaseAdminApp()
  if (!app) return null
  return getFirestore(app)
}

export function getAdminRealtimeDb() {
  const app = getFirebaseAdminApp()
  if (!app) return null
  return getDatabase(app)
}
