"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion-wrapper";
import { Eye, MousePointerClick, Monitor, Globe } from "lucide-react";
import type { AnalyticsSummary } from "@/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your portfolio performance</p>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Views", value: data?.totalViews || 0, icon: Eye, color: "from-blue-500 to-cyan-500" },
          { title: "Project Clicks", value: data?.totalClicks || 0, icon: MousePointerClick, color: "from-purple-500 to-pink-500" },
          { title: "Top Device", value: data?.deviceBreakdown?.[0]?.device || "N/A", icon: Monitor, color: "from-amber-500 to-orange-500" },
          { title: "Top Referrer", value: data?.topReferrers?.[0]?.referrer || "Direct", icon: Globe, color: "from-emerald-500 to-teal-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.title}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader><CardTitle>Device Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(data?.deviceBreakdown || []).map((d) => (
                <div key={d.device} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{d.device}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${Math.min((d.count / (data?.totalViews || 1)) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{d.count}</span>
                  </div>
                </div>
              ))}
              {(!data?.deviceBreakdown || data.deviceBreakdown.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card>
            <CardHeader><CardTitle>Top Referrers</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(data?.topReferrers || []).map((r) => (
                <div key={r.referrer} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 truncate max-w-[200px]">{r.referrer}</span>
                  <span className="text-sm text-gray-500">{r.count} visits</span>
                </div>
              ))}
              {(!data?.topReferrers || data.topReferrers.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No referrer data yet</p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
