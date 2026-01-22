'use client'

import { VisualEditing as SanityVisualEditing } from '@sanity/visual-editing/next-pages-router'
import { useEffect } from 'react'

export function VisualEditing() {
  useEffect(() => {
    // Only enable visual editing in preview mode
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING) {
      return
    }
  }, [])

  // Only render in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_SANITY_VISUAL_EDITING) {
    return null
  }

  return <SanityVisualEditing />
}
