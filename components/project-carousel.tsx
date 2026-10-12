"use client"

import { useEffect, useRef, useState } from "react"
import type { FocusEvent } from "react"
import Link from "next/link"
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react"
import { ProjectImage } from "@/components/project-image"
import { projects } from "@/lib/projects"

export function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const project = projects[activeIndex]

  useEffect(() => {
    if (paused || projects.length < 2) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [paused])

  useEffect(() => {
    const track = trackRef.current
    const card = cardRefs.current[activeIndex]

    if (!track || !card) return

    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    })
  }, [activeIndex])

  function handleBlur(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setPaused(false)
    }
  }

  return (
    <section
      aria-label="Featured projects"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={handleBlur}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      className="mt-4 w-full min-w-0 border-t border-[#028090]/20 pt-3"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#028090]">
          Featured projects
        </h2>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() =>
              setActiveIndex((current) => (current - 1 + projects.length) % projects.length)
            }
            className="flex size-8 items-center justify-center rounded-full text-[#05668D] transition-colors hover:bg-[#02C39A]/30"
          >
            <RiArrowLeftLine className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() =>
              setActiveIndex((current) => (current + 1) % projects.length)
            }
            className="flex size-8 items-center justify-center rounded-full text-[#05668D] transition-colors hover:bg-[#02C39A]/30"
          >
            <RiArrowRightLine className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((featuredProject, index) => (
          <Link
            key={featuredProject.slug}
            ref={(element) => {
              cardRefs.current[index] = element
            }}
            href={`/projects/${featuredProject.slug}`}
            className="group w-[clamp(180px,24vw,300px)] flex-none snap-start"
          >
            <ProjectImage
              src={featuredProject.heroImage}
              alt={featuredProject.heroImageAlt ?? `${featuredProject.title} project preview`}
              sizes="(max-width: 768px) 70vw, 360px"
              className="aspect-video w-full rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="mt-2 block font-heading text-base font-bold text-[#05668D] transition-colors group-hover:text-[#028090] md:text-lg">
              {featuredProject.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}