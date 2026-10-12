"use client"

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

import { BuildingOrb } from "@/components/mysteriousorb"

export function SiteNavigation() {
  return (
    <header className="flex min-h-0 w-full flex-col border-b border-[#028090] bg-[#05668D] px-4 py-3 text-white md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">

      {/* PROFILE */}
      <div className="flex items-center justify-between gap-3 md:block">
        <Link
          href="/home"
          className="flex items-center gap-3"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-[#02C39A] text-lg font-bold text-[#05668D] md:size-14 md:text-xl">
            JT
          </span>

          <span className="text-lg font-bold text-white md:text-xl">
            Jamie Till
          </span>
        </Link>

        <p className="mt-0 shrink-0 text-base text-[#F0F3BD] md:mt-2 md:text-lg">
          BSc Honours Graduate
        </p>
      </div>

      {/* CURRENTLY BUILDING */}
      <div className="mt-2 flex items-center justify-center gap-2 md:mt-4 md:block">
        <div className="h-12 w-12 shrink-0 md:h-32 md:w-full">
          <BuildingOrb />
        </div>

        <div className="text-left md:-mt-3 md:text-center">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#02C39A] md:text-sm md:tracking-[0.2em]">
            Currently building
          </p>

          <p className="mt-0.5 text-base font-semibold text-white md:mt-1 md:text-lg">
            Interactive Portfolio
          </p>

          <div className="mt-0.5 flex items-center justify-start gap-2 md:mt-2 md:justify-center">
            <span className="size-1.5 animate-pulse rounded-full bg-[#02C39A]" />

            <span className="text-sm text-[#F0F3BD]/80 md:text-base">
              In development
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <NavigationMenu className="mt-2 max-w-none md:mt-3 md:flex-none">
        <NavigationMenuList className="grid w-full grid-cols-4 items-center gap-1 md:flex md:flex-col md:items-stretch md:gap-2">

          {/* HOME */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 text-base text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD] md:flex-row md:justify-start md:gap-3 md:px-3 md:text-lg"
              render={<Link href="/home" />}
            >
              <RiHomeLine
                className="size-6 md:size-7"
                aria-hidden="true"
              />
              <span>Home</span>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* ABOUT */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 text-base text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD] md:flex-row md:justify-start md:gap-3 md:px-3 md:text-lg"
              render={<Link href="/about" />}
            >
              <RiUserLine
                className="size-6 md:size-7"
                aria-hidden="true"
              />
              <span>About Me</span>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* PROJECTS */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 text-base text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD] md:flex-row md:justify-start md:gap-3 md:px-3 md:text-lg"
              render={<Link href="/projects" />}
            >
              <RiFolderLine
                className="size-6 md:size-7"
                aria-hidden="true"
              />
              <span>Projects</span>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* CONTACT */}
          <NavigationMenuItem>
            <NavigationMenuLink
              className="flex flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 text-base text-white transition-colors hover:bg-[#028090] hover:text-[#F0F3BD] md:flex-row md:justify-start md:gap-3 md:px-3 md:text-lg"
              render={<Link href="/contact" />}
            >
              <RiMailLine
                className="size-6 md:size-7"
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