// // (dashboard) /dashboard

// import { auth } from "@/lib/auth";
// import { Shell } from "@/components/layout/shell";
// import { redirect } from "next/navigation";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();

//   if (!session) {
//     redirect("/login");
//   }

//   return <Shell>{children}</Shell>;

//   //   return <Shell>{children}</Shell>;
// }

import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/navbar";
import React from "react";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar session={session} />
        <main className="flex-1 overflow-y-auto">
          <Header />
          <div className="/p-8">{children}</div>
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
        </main>
      </div>
    </div>
  );
}
