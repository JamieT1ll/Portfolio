"use client"

import Image from "next/image"
import { useState } from "react"

type ProjectImageProps = {
  src?: string
  alt: string
  sizes?: string
  className?: string
}

export function ProjectImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: ProjectImageProps) {
  const [imageUnavailable, setImageUnavailable] = useState(!src)

  return (
    <div className={`relative isolate overflow-hidden bg-[#D9EEE5] ${className}`}>
      {src && !imageUnavailable ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          onError={() => setImageUnavailable(true)}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,#02C39A_0%,transparent_25%),linear-gradient(135deg,#05668D,#028090)]"
        />
      )}
    </div>
  )
}