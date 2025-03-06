import type React from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardShell } from "@/components/layout/dashboard-shell"

// Loading fallback
function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-16 h-full border-r bg-muted/10 animate-pulse" />
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b bg-muted/10 animate-pulse" />
        <div className="flex-1 p-8 space-y-4">
          <div className="h-8 w-1/3 bg-muted/10 rounded-md animate-pulse" />
          <div className="h-64 bg-muted/10 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SidebarProvider>
        <DashboardShell session={session}>{children}</DashboardShell>
      </SidebarProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
          className: "text-foreground border-border bg-background",
        }}
      />
    </Suspense>
  )
}

