import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/docs-sidebar-nav" // I will create this component next

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
        <div className="relative h-full overflow-y-auto p-6 pr-0 lg:p-8">
            <DocsSidebarNav items={docsConfig.sidebarNav} />
        </div>
      </aside>
      <main className="relative py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}