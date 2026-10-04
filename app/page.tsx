import Link from "next/link"
import { Kitty3D } from "@/components/kitty-3d"

export default function WelcomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cat/yarn visual layer — NEVER catches clicks */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Kitty3D />
      </div>

      {/* Page content */}
      <div className="pointer-events-none relative z-10 flex min-h-screen items-center justify-center px-6 py-16 text-center">
        <div className="pt-[60vh]">
          <h1 className="font-heading text-5xl font-bold text-[#05668D]">
            Welcome
          </h1>

          <p className="mt-4 text-lg text-[#028090]">
            Thanks for visiting my portfolio.
          </p>

          <Link
            href="/home"
            className="pointer-events-auto relative z-20 mt-8 inline-block cursor-pointer font-semibold text-[#00A896] underline underline-offset-4 hover:text-[#028090]"
          >
            Enter portfolio
          </Link>
        </div>
      </div>
    </main>
  )
}