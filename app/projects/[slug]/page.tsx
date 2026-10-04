import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProject, projects } from "@/lib/projects"

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) return notFound()

  return (
    <main className="min-h-screen bg-[#F0F3BD] text-[#05668D]">

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-12">

        {/* BACK */}
        <Link
          href="/projects"
          className="animate-fade-up inline-block font-semibold text-[#028090] transition hover:-translate-x-1"
        >
          ← Back to projects
        </Link>

        {/* HERO */}
        <header className="mt-16">
          <p className="animate-fade-up font-semibold uppercase tracking-[0.2em] text-[#028090]">
            {project.subtitle}
          </p>

          <h1 className="animate-fade-up animation-delay-100 mt-3 font-heading text-5xl font-bold md:text-7xl">
            {project.title}
          </h1>

          <p className="animate-fade-up animation-delay-200 mt-6 max-w-3xl text-xl leading-8">
            {project.description}
          </p>

          <div className="animate-fade-up animation-delay-300 mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#02C39A]/30 px-4 py-2 text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* HERO IMAGE */}
        {project.heroImage && (
          <div className="animate-scale-in relative mt-14 aspect-[16/9] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* PROJECT INFO */}
        <section className="mt-12 grid gap-6 border-y border-[#02C39A] py-8 sm:grid-cols-3">

          {project.role && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#028090]">
                Role
              </p>
              <p className="mt-2 font-semibold">
                {project.role}
              </p>
            </div>
          )}

          {project.type && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#028090]">
                Type
              </p>
              <p className="mt-2 font-semibold">
                {project.type}
              </p>
            </div>
          )}

          {project.duration && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#028090]">
                Duration
              </p>
              <p className="mt-2 font-semibold">
                {project.duration}
              </p>
            </div>
          )}

        </section>

        {/* CONTENT */}
        <div className="mt-24 space-y-32">

          {project.sections.map((section, index) => (
            <section
              key={section.title}
              className="grid gap-10 md:grid-cols-2 md:items-center"
            >

              <div
                className={
                  index % 2 === 1
                    ? "md:order-2"
                    : ""
                }
              >
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#028090]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">
                  {section.title}
                </h2>

                <p className="mt-5 text-lg leading-8">
                  {section.text}
                </p>
              </div>

              {section.image && (
                <div
                  className={
                    index % 2 === 1
                      ? "md:order-1"
                      : ""
                  }
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                    <Image
                      src={section.image}
                      alt={
                        section.imageAlt ??
                        section.title
                      }
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              )}

            </section>
          ))}

        </div>

        {/* LINKS */}
        <section className="mt-32 rounded-3xl bg-[#05668D] p-8 text-white md:p-12">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#02C39A]">
            Explore the project
          </p>

          <h2 className="mt-3 font-heading text-3xl font-bold">
            Want to see more?
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#02C39A] px-6 py-3 font-semibold text-[#05668D] transition hover:-translate-y-1"
              >
                View project ↗
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold transition hover:-translate-y-1 hover:bg-white/10"
              >
                View source ↗
              </a>
            )}

          </div>

        </section>

      </div>
    </main>
  )
}