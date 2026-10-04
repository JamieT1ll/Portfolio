"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  RiHomeLine,
  RiFolderLine,
  RiMailLine,
  RiUserLine,
} from "@remixicon/react"

import { projects } from "@/lib/projects"
import { BuildingOrb } from "@/components/mysteriousorb"

export function SiteNavigation() {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [projectsReady, setProjectsReady] = useState(false)

  useEffect(() => {
    setProjectsOpen(
      window.localStorage.getItem("projects-menu-open") === "true"
    )

    requestAnimationFrame(() => {
      setProjectsReady(true)
    })
  }, [])

  function toggleProjects() {
    setProjectsOpen((open) => {
      const nextOpen = !open

      window.localStorage.setItem(
        "projects-menu-open",
        String(nextOpen)
      )

      return nextOpen
    })
  }

  return (
    <header className="flex min-h-0 w-full flex-col border-r border-[#028090] bg-[#05668D] px-6 py-6 text-white md:min-h-screen md:w-64 md:px-6 md:py-8">

      {/* PROFILE */}
      <div>
        <Link
          href="/home"
          className="flex items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-[#02C39A] font-bold text-[#05668D]">
            JT
          </span>

          <span className="font-bold text-white">
            Jamie Till
          </span>
        </Link>

        <p className="mt-2 text-sm text-[#F0F3BD]">
          BSc Honours Graduate
        </p>
      </div>

      {/* CURRENTLY BUILDING */}
      <div className="mt-4">
        <BuildingOrb />

        <div className="-mt-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#02C39A]">
            Currently building
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            Interactive Portfolio
          </p>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-[#02C39A]" />

            <span className="text-[11px] text-[#F0F3BD]/80">
              In development
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <NavigationMenu className="-mt-38 max-w-none">
        <NavigationMenuList className="flex flex-col items-stretch gap-2">

          {/* HOME */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex items-center gap-3 rounded-md px-3 py-2 text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD]"
              render={<Link href="/home" />}
            >
              <RiHomeLine
                className="size-5"
                aria-hidden="true"
              />
              <span>Home</span>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* ABOUT */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex items-center gap-3 rounded-md px-3 py-2 text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD]"
              render={<Link href="/about" />}
            >
              <RiUserLine
                className="size-5"
                aria-hidden="true"
              />
              <span>About Me</span>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* PROJECTS */}
          <NavigationMenuItem>
            <div>
              <button
                type="button"
                onClick={toggleProjects}
                aria-expanded={projectsOpen}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD]"
              >
                <span className="flex items-center gap-3">
                  <RiFolderLine
                    className="size-5"
                    aria-hidden="true"
                  />
                  Projects
                </span>

                <span
                  className={`text-sm ${
                    projectsReady
                      ? "transition-transform"
                      : ""
                  } ${
                    projectsOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              {/* PROJECT SUBMENU */}
              <div
                className={`projects-list ml-3 border-l border-[#02C39A] pl-2 ${
                  projectsReady
                    ? "projects-list-transition"
                    : ""
                } ${
                  projectsOpen
                    ? "projects-list-open"
                    : ""
                }`}
              >
                <div className="projects-list-content flex flex-col gap-1">

                  <NavigationMenuLink
                    className="text-white hover:bg-[#028090] hover:text-[#F0F3BD]"
                    render={<Link href="/projects" />}
                  >
                    <span className="flex items-center gap-2">
                      <RiFolderLine
                        className="size-4"
                        aria-hidden="true"
                      />
                      All projects
                    </span>
                  </NavigationMenuLink>

                  {projects.map((project) => (
                    <NavigationMenuLink
                      key={project.slug}
                      className="text-white hover:bg-[#028090] hover:text-[#F0F3BD]"
                      render={
                        <Link
                          href={`/projects/${project.slug}`}
                        />
                      }
                    >
                      <span className="flex items-center gap-2">
                        <RiFolderLine
                          className="size-4"
                          aria-hidden="true"
                        />

                        {project.title}
                      </span>
                    </NavigationMenuLink>
                  ))}

                </div>
              </div>
            </div>
          </NavigationMenuItem>

          {/* CONTACT */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex items-center gap-3 rounded-md px-3 py-2 text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD]"
              render={<Link href="/contact" />}
            >
              <RiMailLine
                className="size-5"
                aria-hidden="true"
              />
              <span>Contact</span>
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>

    </header>
  )
}