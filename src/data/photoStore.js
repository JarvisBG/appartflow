// ─────────────────────────────────────────────────────────────
//  Photos uploadées côté navigateur (démo, sans backend).
//  Stockées en base64 dans localStorage, redimensionnées avant
//  sauvegarde pour rester sous la limite de ~5 Mo.
// ─────────────────────────────────────────────────────────────
import { useSyncExternalStore } from 'react'

const PREFIX = 'appartflow:photos:'
const listeners = new Set()

function keyFor(id) {
  return PREFIX + id
}

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

// Snapshot mis en cache par unité : useSyncExternalStore exige une
// référence stable tant que la donnée n'a pas changé.
const cache = {}
function getSnapshot(id) {
  let raw = '[]'
  try {
    raw = localStorage.getItem(keyFor(id)) || '[]'
  } catch {
    raw = '[]'
  }
  if (!cache[id] || cache[id].raw !== raw) {
    let value = []
    try {
      value = JSON.parse(raw)
    } catch {
      value = []
    }
    cache[id] = { raw, value }
  }
  return cache[id].value
}

function write(id, arr) {
  try {
    localStorage.setItem(keyFor(id), JSON.stringify(arr))
  } catch (e) {
    // Quota dépassé : on prévient l'appelant
    throw e
  }
  emit()
}

export function getPhotos(id) {
  return getSnapshot(id)
}

export function addPhotos(id, dataUrls) {
  write(id, [...getSnapshot(id), ...dataUrls])
}

export function removePhoto(id, index) {
  const next = getSnapshot(id).filter((_, i) => i !== index)
  write(id, next)
}

// Hook React réactif
export function useUnitPhotos(id) {
  return useSyncExternalStore(subscribe, () => getSnapshot(id))
}

// Convertit un fichier image en data URL redimensionnée (JPEG)
export function fileToDataUrl(file, maxW = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Fichier non image'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Lecture impossible'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Image invalide'))
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
