"use client"

import { useEffect } from "react"

export const pointerPosition = {
  x: 0.85,
  y: 0.8,
  hasMoved: false,
  isOverNavbar: false,
}

export function PointerTracker() {
  useEffect(() => {
    const trackPointer = (event: PointerEvent) => {
      pointerPosition.hasMoved = true
      pointerPosition.x =
        (event.clientX / window.innerWidth) * 2 - 1

      pointerPosition.y =
        -(event.clientY / window.innerHeight) * 2 + 1

      pointerPosition.isOverNavbar =
        event.target instanceof Element &&
        event.target.closest("header") !== null

    }

    const clearNavbarHover = () => {
      pointerPosition.isOverNavbar = false
    }

    window.addEventListener("pointermove", trackPointer)
    window.addEventListener("pointerleave", clearNavbarHover)

    return () => {
      window.removeEventListener("pointermove", trackPointer)
      window.removeEventListener("pointerleave", clearNavbarHover)
    }
  }, [])

  return null
}