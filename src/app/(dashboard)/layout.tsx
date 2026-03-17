import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardThemeProvider } from "@/components/dashboard/theme-provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardThemeProvider>
      <div className="min-h-screen bg-theme-bg">
        <Sidebar />
        <main className="ml-16 md:ml-64 min-h-screen transition-all duration-300">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </DashboardThemeProvider>
  );
}
