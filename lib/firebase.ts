'use client'

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyA3O0EhM8uIXLw_6_NiiNd7N9Q8zZ3RtZU',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'restaurant-d3044.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'restaurant-d3044',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'restaurant-d3044.appspot.com',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '922555946454',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    '1:922555946454:web:d6474d118108dccd83c077',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-6G8NTQXV97',
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
    'https://restaurant-d3044-default-rtdb.firebaseio.com',
}

let app: FirebaseApp

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
  return app
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export function getFirestoreDb() {
  return getFirestore(getFirebaseApp())
}

export function getRealtimeDb() {
  return getDatabase(getFirebaseApp())
}
