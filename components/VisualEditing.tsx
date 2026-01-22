'use client'

import { VisualEditing as SanityVisualEditing } from '@sanity/visual-editing/next-app-router'
import { useEffect } from 'react'

export function VisualEditing() {
  useEffect(() => {
    // Suppress visual editing connection errors in console
    // These are non-critical warnings that occur when visual editing can't connect
    // Visual editing is optional and works best with proper token setup
    const originalError = console.error
    const originalWarn = console.warn

    const shouldSuppress = (message: any): boolean => {
      const msg = typeof message === 'string' ? message : message?.toString() || ''
      return (
        msg.includes('visual editing') ||
        msg.includes('Unable to connect to visual editing') ||
        msg.includes('@sanity/visual-editing') ||
        msg.includes('visual-editing')
      )
    }

    console.error = (...args: any[]) => {
      if (!shouldSuppress(args[0])) {
        originalError(...args)
      }
    }

    console.warn = (...args: any[]) => {
      if (!shouldSuppress(args[0])) {
        originalWarn(...args)
      }
    }

    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return <SanityVisualEditing zaiusToken={process.env.NEXT_PUBLIC_SANITY_ZAIUS_TOKEN} />
}
