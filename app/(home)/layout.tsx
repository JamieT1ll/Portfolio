import { SiteNavigation } from "@/components/site-navigation"

export default function HomeLayout({ children }: LayoutProps<"/home">) {
return (
<div className="relative z-30 flex min-h-screen flex-col md:items-stretch md:flex-row">
<aside className="relative z-30 shrink-0 md:flex md:self-stretch">
<SiteNavigation />
</aside>

  <main className="min-w-0 flex-1">
    {children}
  </main>
</div>

)
}