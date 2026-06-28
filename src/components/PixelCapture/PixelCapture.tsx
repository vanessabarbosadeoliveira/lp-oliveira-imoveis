'use client'

import { useEffect } from 'react'

// Reads ?pixel_id= from the URL and persists it in sessionStorage so any
// form submitted later in the same tab can attribute the registration/login.
export default function PixelCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pixelId = params.get('pixel_id')
    if (pixelId) sessionStorage.setItem('pixel_id', pixelId)
  }, [])

  return null
}
