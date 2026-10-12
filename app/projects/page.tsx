"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { ProjectImage } from "@/components/project-image"
import { projects } from "@/lib/projects"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort((first, second) => first.localeCompare(second))

  const tagFromUrl = searchParams.get("tag")
  const selectedTag =
    tagFromUrl && tags.includes(tagFromUrl) ? tagFromUrl : ""

  const visibleProjects = selectedTag
    ? projects.filter((project) => project.tags.includes(selectedTag))
    : projects

  function handleTagChange(tag: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (tag) {
      params.set("tag", tag)
    } else {
      params.delete("tag")
    }

    const query = params.toString()
    router.push(query ? `/projects?${query}` : "/projects")
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:px-12">
      <p className="animate-fade-up font-semibold uppercase tracking-[0.2em] text-[#028090]">
        Selected work
      </p>

      <h1 className="animate-fade-up animation-delay-100 mt-3 font-heading text-4xl font-bold text-[#05668D] md:text-6xl">
        Projects I&apos;ve been building.
      </h1>

      <div className="mt-8 flex items-center gap-3">
        <label
          htmlFor="project-tag-filter"
          className="text-sm font-semibold text-[#05668D]"
        >
          Filter by tag
        </label>

        <select
          id="project-tag-filter"
          value={selectedTag}
          onChange={(event) => handleTagChange(event.target.value)}
          className="min-w-0 max-w-full rounded-md border border-[#028090]/30 bg-white/80 px-3 py-2 text-sm text-[#05668D]"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {visibleProjects.map((project, index) => (
          <Card
            key={project.slug}
            className="group h-full border-[#02C39A]/40 bg-white/75 py-0 transition-all duration-300 hover:-translate-y-2 hover:border-[#00A896] hover:shadow-xl"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="block"
            >
              
<ProjectImage
  src={project.thumbnailImage ?? project.heroImage}
  alt={
    project.thumbnailImageAlt ??
    project.heroImageAlt ??
    `${project.title} project preview`
  }
  sizes="(max-width: 768px) 100vw, 50vw"
  className="aspect-[16/9] w-full"
/>

            </Link>

            <CardHeader className="py-6">
              <CardTitle className="text-2xl text-[#05668D] transition-transform duration-300 group-hover:translate-x-1">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:underline"
                >
                  {project.title}
                </Link>
              </CardTitle>

              <p className="text-sm font-medium text-[#028090]/80">
  {new Date(`${project.date}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      month: "long",
      year: "numeric",
    }
  )}
</p>

              <CardDescription className="leading-7 text-[#028090]">
                {project.description}
              </CardDescription>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/projects?tag=${encodeURIComponent(tag)}`}
                    onClick={(event) => event.stopPropagation()}
                    className="relative z-10 rounded-full bg-[#F0F3BD] px-3 py-1 text-xs font-semibold text-[#05668D] transition-colors hover:bg-[#02C39A]/40"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <p className="mt-10 text-[#05668D]">
          No projects found for this tag.
        </p>
      )}
    </main>
  )
}