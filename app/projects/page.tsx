import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { projects } from "@/lib/projects"

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:px-12">
      <p className="animate-fade-up font-semibold uppercase tracking-[0.2em] text-[#028090]">
        Selected work
      </p>

      <h1 className="animate-fade-up animation-delay-100 mt-3 font-heading text-4xl font-bold text-[#05668D] md:text-6xl">
        Projects I&apos;ve been building.
      </h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="animate-fade-up"
            style={{
              animationDelay: `${200 + index * 120}ms`,
            }}
          >
            <Card className="group h-full border-[#02C39A]/40 bg-white/75 transition-all duration-300 hover:-translate-y-2 hover:border-[#00A896] hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#05668D] transition-transform duration-300 group-hover:translate-x-1">
                  {project.title}
                </CardTitle>

                <CardDescription className="leading-7 text-[#028090]">
                  {project.description}
                </CardDescription>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F0F3BD] px-3 py-1 text-xs font-semibold text-[#05668D] transition-transform duration-200 group-hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}