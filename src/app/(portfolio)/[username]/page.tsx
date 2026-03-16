import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortfolioRenderer from "@/components/portfolio/portfolio-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, headline: true, bio: true, image: true },
  });

  if (!user) return { title: "Not Found" };

  return {
    title: `${user.name} | Developer Portfolio`,
    description: user.bio || user.headline || `${user.name}'s developer portfolio`,
    openGraph: {
      title: `${user.name} | Developer Portfolio`,
      description: user.bio || user.headline || `${user.name}'s developer portfolio`,
      images: user.image ? [{ url: user.image }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name} | Developer Portfolio`,
      description: user.bio || user.headline || "",
    },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username, isPublic: true },
    include: {
      projects: { orderBy: { order: "asc" } },
      skills: { orderBy: { order: "asc" } },
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
      socialLinks: { orderBy: { order: "asc" } },
      themeSettings: true,
    },
  });

  if (!user) notFound();

  return <PortfolioRenderer data={{ user }} />;
}
