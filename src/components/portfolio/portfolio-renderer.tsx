"use client";

import { useEffect } from "react";
import MinimalTemplate from "./templates/minimal";
import DarkHackerTemplate from "./templates/dark-hacker";
import ModernTechTemplate from "./templates/modern-tech";
import CreativeDesignerTemplate from "./templates/creative-designer";
import GradientWaveTemplate from "./templates/gradient-wave";
import NeonCyberTemplate from "./templates/neon-cyber";
import ElegantSerifTemplate from "./templates/elegant-serif";
import GlassmorphismTemplate from "./templates/glassmorphism";
import RetroTerminalTemplate from "./templates/retro-terminal";
import NatureGreenTemplate from "./templates/nature-green";
import SunsetWarmTemplate from "./templates/sunset-warm";
import OceanBlueTemplate from "./templates/ocean-blue";
import MonochromeTemplate from "./templates/monochrome";
import AuroraBorealisTemplate from "./templates/aurora-borealis";
import { PortfolioNav } from "./portfolio-nav";
import { PortfolioFooter } from "./portfolio-footer";

interface Props {
  data: { user: any };
}

const templates: Record<string, React.ComponentType<Props>> = {
  minimal: MinimalTemplate,
  "dark-hacker": DarkHackerTemplate,
  "modern-tech": ModernTechTemplate,
  "creative-designer": CreativeDesignerTemplate,
  "gradient-wave": GradientWaveTemplate,
  "neon-cyber": NeonCyberTemplate,
  "elegant-serif": ElegantSerifTemplate,
  glassmorphism: GlassmorphismTemplate,
  "retro-terminal": RetroTerminalTemplate,
  "nature-green": NatureGreenTemplate,
  "sunset-warm": SunsetWarmTemplate,
  "ocean-blue": OceanBlueTemplate,
  monochrome: MonochromeTemplate,
  "aurora-borealis": AuroraBorealisTemplate,
};

export default function PortfolioRenderer({ data }: Props) {
  const templateName = data.user.themeSettings?.template || "minimal";
  const Template = templates[templateName] || MinimalTemplate;

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.user.id,
        event: "page_view",
        path: `/${data.user.username}`,
        referrer: typeof document !== "undefined" ? document.referrer : null,
      }),
    }).catch(() => {});
  }, [data.user.id, data.user.username]);

  return (
    <>
      <PortfolioNav userName={data.user.name || data.user.username || "Portfolio"} />
      <Template data={data} />
      <PortfolioFooter
        userName={data.user.name || data.user.username || "Developer"}
        socialLinks={data.user.socialLinks}
      />
    </>
  );
}
