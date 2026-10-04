import { SiteNavigation } from "@/components/site-navigation"

export default function ProjectsLayout({ children }: LayoutProps<"/projects">) {
  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      {/* Navbar stays stationary */}
      <div className="shrink-0">
        <SiteNavigation />
      </div>

      {/* Only project content scrolls */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}