import type { MealPhoto, Reel } from '@/types'

const DB_NAME = 'today-meal'
const DB_VERSION = 1
const STORE_PHOTOS = 'photos'
const STORE_REELS = 'reels'

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error)
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        const store = db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' })
        store.createIndex('takenAt', 'takenAt')
        store.createIndex('mealType', 'mealType')
      }
      if (!db.objectStoreNames.contains(STORE_REELS)) {
        db.createObjectStore(STORE_REELS, { keyPath: 'id' })
      }
    }
  })
  return dbPromise
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function addPhoto(photo: MealPhoto): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_PHOTOS, 'readwrite')
  await request(tx.objectStore(STORE_PHOTOS).add(photo))
}

export async function getPhotoById(id: string): Promise<MealPhoto | undefined> {
  const db = await openDB()
  const tx = db.transaction(STORE_PHOTOS, 'readonly')
  return request<MealPhoto | undefined>(tx.objectStore(STORE_PHOTOS).get(id))
}

export async function listPhotos(options: { from?: string; to?: string } = {}): Promise<MealPhoto[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_PHOTOS, 'readonly')
  const all = await request<MealPhoto[]>(tx.objectStore(STORE_PHOTOS).getAll())

  let result = all
  if (options.from) {
    const fromTs = options.from
    result = result.filter((p) => p.takenAt >= fromTs)
  }
  if (options.to) {
    const toTs = options.to
    result = result.filter((p) => p.takenAt <= toTs)
  }
  return result.sort((a, b) => b.takenAt.localeCompare(a.takenAt))
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_PHOTOS, 'readwrite')
  await request(tx.objectStore(STORE_PHOTOS).delete(id))
}

export async function countPhotos(): Promise<number> {
  const db = await openDB()
  const tx = db.transaction(STORE_PHOTOS, 'readonly')
  return request<number>(tx.objectStore(STORE_PHOTOS).count())
}

export async function addReel(reel: Reel): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_REELS, 'readwrite')
  await request(tx.objectStore(STORE_REELS).put(reel))
}

export async function getReelById(id: string): Promise<Reel | undefined> {
  const db = await openDB()
  const tx = db.transaction(STORE_REELS, 'readonly')
  return request<Reel | undefined>(tx.objectStore(STORE_REELS).get(id))
}

export async function listReels(): Promise<Reel[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_REELS, 'readonly')
  const all = await request<Reel[]>(tx.objectStore(STORE_REELS).getAll())
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function deleteReel(id: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_REELS, 'readwrite')
  await request(tx.objectStore(STORE_REELS).delete(id))
}

export function generatePhotoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
