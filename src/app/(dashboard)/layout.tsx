import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardThemeProvider } from "@/components/dashboard/theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <DashboardThemeProvider>
      <div className="min-h-screen bg-theme-bg lg:ml-64">
        <Sidebar />
        <main className="min-h-screen transition-all duration-300 pt-14 lg:pt-0">
          <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </DashboardThemeProvider>
  );
}
