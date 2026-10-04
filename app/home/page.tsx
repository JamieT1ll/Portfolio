import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Kitty3D } from "@/components/kitty-3d"

export default function HomePage() {
  return (
<main className="relative flex min-h-screen items-center overflow-hidden bg-[#F0F3BD] px-6 py-16">

  {/* Content moved DOWN */}
<div className="relative z-10 mx-auto grid w-full max-w-5xl translate-y-40 gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
    <section>
      <p className="animate-fade-up mb-4 font-semibold uppercase tracking-[0.2em] text-[#028090]">
        Portfolio
      </p>

      <h1 className="animate-fade-up animation-delay-100 max-w-xl font-heading text-5xl font-bold leading-tight text-[#05668D] md:text-7xl">
        Hi, I&apos;m Jamie.
      </h1>

      <p className="animate-fade-up animation-delay-200 mt-6 max-w-xl text-lg leading-8 text-[#05668D]">
        I build thoughtful web applications with modern tools and a focus
        on clear, useful experiences.
      </p>

      <div className="animate-fade-up animation-delay-300">
        <Link href="/projects">
          <Button className="relative z-30 mt-8 bg-[#00A896] text-white transition-transform duration-200 hover:scale-105 hover:bg-[#028090]">
            View my projects
          </Button>
        </Link>
      </div>
    </section>

    <div className="animate-card-in animation-delay-200 rounded-2xl border border-[#02C39A] bg-white/70 p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#028090]">
        Currently exploring
      </p>

      <p className="mt-4 text-2xl font-semibold text-[#05668D]">
        Frontend development, accessible interfaces, and creative problem
        solving.
      </p>
    </div>

  </div>

  {/* Cat moved UP */}
<div className="pointer-events-none absolute inset-0 z-20">
    <Kitty3D />
  </div>

</main>
  )
}