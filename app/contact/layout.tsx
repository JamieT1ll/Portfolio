import { SiteNavigation } from "@/components/site-navigation"

export default function ContactLayout({ children }: LayoutProps<"/contact">) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <SiteNavigation />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
