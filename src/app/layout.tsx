import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevPortfolio Builder - Create Beautiful Developer Portfolios",
  description: "Build stunning developer portfolio websites automatically. Showcase your skills, projects, and experience with beautiful templates.",
  keywords: ["portfolio", "developer", "portfolio builder", "web developer", "portfolio generator"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="theme-dark accent-indigo">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
