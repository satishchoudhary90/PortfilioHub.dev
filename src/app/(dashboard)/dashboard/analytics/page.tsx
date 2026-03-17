"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/shared/motion-wrapper";
import {
  Eye,
  MousePointerClick,
  Monitor,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  Smartphone,
  Tablet,
  Laptop,
  Chrome,
  Activity,
  BarChart3,
  Clock,
  FolderKanban,
  Loader2,
  RefreshCw,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyticsSummary } from "@/types";

const deviceIcons: Record<string, any> = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Desktop: Laptop,
};

const deviceColors: Record<string, string> = {
  Mobile: "from-rose-500 to-pink-500",
  Tablet: "from-amber-500 to-orange-500",
  Desktop: "from-blue-500 to-indigo-500",
};

const browserColors: Record<string, string> = {
  Chrome: "#4285F4",
  Firefox: "#FF7139",
  Safari: "#006CFF",
  Edge: "#0078D7",
  Other: "#6B7280",
};

function TrendBadge({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-theme-text-secondary bg-gray-500/10 px-1.5 py-0.5 rounded-md">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }
  const isUp = value > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-md ${isUp ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
      {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {isUp ? "+" : ""}{value}%
    </span>
  );
}

function MiniChart({ data, maxHeight = 40 }: { data: number[]; maxHeight?: number }) {
  const max = Math.max(...data, 1);
  const barW = Math.max(2, Math.min(8, Math.floor(200 / data.length)));
  const gap = Math.max(1, Math.min(2, Math.floor(60 / data.length)));

  return (
    <div className="flex items-end" style={{ height: maxHeight, gap }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: Math.max(2, (v / max) * maxHeight) }}
          transition={{ delay: i * 0.02, duration: 0.4, ease: "easeOut" }}
          className="rounded-sm bg-gradient-to-t from-indigo-500 to-purple-400 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: barW, minHeight: 2 }}
          title={`${v} views`}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value, max, color = "from-indigo-500 to-purple-500", label, count }: { value: number; max: number; color?: string; label: string; count: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-theme-text-secondary truncate">{label}</span>
        <span className="text-theme-muted tabular-nums shrink-0 ml-2">{count}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function EventIcon({ event }: { event: string }) {
  switch (event) {
    case "page_view":
      return <Eye className="h-3.5 w-3.5 text-blue-400" />;
    case "project_click":
      return <MousePointerClick className="h-3.5 w-3.5 text-purple-400" />;
    case "contact_form":
      return <Globe className="h-3.5 w-3.5 text-emerald-400" />;
    default:
      return <Activity className="h-3.5 w-3.5 text-theme-text-secondary" />;
  }
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatEventLabel(event: string): string {
  return event.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

interface KpiItem {
  id: string;
  title: string;
  value: number;
  sub: string;
  trend?: number;
  icon: any;
  color: string;
}

function SortableKpiCard({ item }: { item: KpiItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.7 : 1,
  };
  const Icon = item.icon;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border-theme-border bg-theme-card backdrop-blur-xl hover:bg-white/[0.07] transition-all relative group ${isDragging ? "ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-500/10" : ""}`}>
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1 rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all z-10"
          title="Drag to reorder"
        >
          <GripVertical className="h-3.5 w-3.5 text-theme-muted" />
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-theme-text-secondary truncate">{item.title}</p>
              <p className="text-xl sm:text-3xl font-bold text-theme-text mt-1 tabular-nums">{item.value.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] sm:text-xs text-theme-muted">{item.sub}</span>
                {item.trend !== undefined && <TrendBadge value={item.trend} />}
              </div>
            </div>
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${item.color} opacity-80 shrink-0`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-theme-text" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpiOrder, setKpiOrder] = useState(["total-views", "project-clicks", "this-week", "avg-day"]);

  async function fetchData(isRefresh = false) {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      setData(json);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { fetchData(); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleKpiDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setKpiOrder(prev => arrayMove(prev, prev.indexOf(active.id as string), prev.indexOf(over.id as string)));
  }

  const kpiItems: Record<string, KpiItem> = {
    "total-views": {
      id: "total-views",
      title: "Total Views",
      value: data?.totalViews || 0,
      sub: `${data?.viewsLast30 || 0} last 30d`,
      trend: data?.viewsTrend || 0,
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
    },
    "project-clicks": {
      id: "project-clicks",
      title: "Project Clicks",
      value: data?.totalClicks || 0,
      sub: `${data?.clicksLast30 || 0} last 30d`,
      trend: data?.clicksTrend || 0,
      icon: MousePointerClick,
      color: "from-purple-500 to-pink-500",
    },
    "this-week": {
      id: "this-week",
      title: "This Week",
      value: data?.thisWeekViews || 0,
      sub: "views in 7 days",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-500",
    },
    "avg-day": {
      id: "avg-day",
      title: "Avg / Day",
      value: data?.viewsLast30 ? Math.round(data.viewsLast30 / 30) : 0,
      sub: "daily average",
      icon: Activity,
      color: "from-amber-500 to-orange-500",
    },
  };

  const chartData = data?.viewsByDay?.map(d => d.count) || [];
  const totalDeviceCount = data?.deviceBreakdown?.reduce((s, d) => s + d.count, 0) || 1;
  const totalBrowserCount = data?.browserBreakdown?.reduce((s, b) => s + b.count, 0) || 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-sm text-theme-text-secondary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-text">Analytics</h1>
            <p className="text-theme-text-secondary mt-1 text-sm sm:text-base">Track your portfolio performance over the last 30 days</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => fetchData(true)} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </FadeIn>

      {/* KPI Cards — Drag to reorder */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleKpiDragEnd}>
        <SortableContext items={kpiOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {kpiOrder.map(id => {
              const item = kpiItems[id];
              return item ? <SortableKpiCard key={id} item={item} /> : null;
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Views Chart */}
      <FadeIn delay={0.15}>
        <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Views Over Time
              </CardTitle>
              <span className="text-xs text-theme-muted">Last 30 days</span>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 && chartData.some(v => v > 0) ? (
              <div className="space-y-3">
                <div className="overflow-x-auto pb-2 -mx-2 px-2">
                  <div className="min-w-[300px]">
                    <MiniChart data={chartData} maxHeight={100} />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-theme-muted">
                  <span>{data?.viewsByDay?.[0]?.date}</span>
                  <span>{data?.viewsByDay?.[data.viewsByDay.length - 1]?.date}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-theme-muted">
                <BarChart3 className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No view data yet</p>
                <p className="text-xs mt-1">Share your portfolio to start tracking views</p>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Middle Row: Devices & Browsers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <FadeIn delay={0.2}>
          <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Monitor className="h-4 w-4 text-blue-400" />
                Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.deviceBreakdown && data.deviceBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {/* Visual summary */}
                  <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-white/5">
                    {data.deviceBreakdown.map(d => {
                      const pct = (d.count / totalDeviceCount) * 100;
                      return (
                        <motion.div
                          key={d.device}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full bg-gradient-to-r ${deviceColors[d.device] || "from-gray-500 to-gray-400"} rounded-full`}
                        />
                      );
                    })}
                  </div>
                  {/* Detail rows */}
                  <div className="space-y-3">
                    {data.deviceBreakdown.map(d => {
                      const Icon = deviceIcons[d.device] || Monitor;
                      const pct = Math.round((d.count / totalDeviceCount) * 100);
                      return (
                        <div key={d.device} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${deviceColors[d.device] || "from-gray-600 to-gray-500"}`}>
                              <Icon className="h-3.5 w-3.5 text-theme-text" />
                            </div>
                            <span className="text-sm text-theme-text-secondary">{d.device}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-theme-muted">{pct}%</span>
                            <span className="text-sm text-theme-text font-medium tabular-nums w-8 text-right">{d.count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState icon={Monitor} text="No device data yet" />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.25}>
          <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Chrome className="h-4 w-4 text-blue-400" />
                Browsers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.browserBreakdown && data.browserBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {data.browserBreakdown.map(b => {
                    const pct = Math.round((b.count / totalBrowserCount) * 100);
                    const color = browserColors[b.browser] || browserColors.Other;
                    return (
                      <div key={b.browser} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-theme-text-secondary">{b.browser}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-theme-muted">{pct}%</span>
                            <span className="text-theme-text font-medium tabular-nums w-8 text-right">{b.count}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon={Chrome} text="No browser data yet" />
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Bottom Row: Referrers, Top Projects, Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <FadeIn delay={0.3}>
          <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                Top Referrers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.topReferrers && data.topReferrers.length > 0 ? (
                <div className="space-y-2.5">
                  {data.topReferrers.map((r, i) => {
                    const maxCount = data.topReferrers[0]?.count || 1;
                    return (
                      <ProgressBar
                        key={r.referrer}
                        value={r.count}
                        max={maxCount}
                        label={r.referrer}
                        count={r.count}
                        color={i === 0 ? "from-emerald-500 to-teal-500" : "from-emerald-500/60 to-teal-500/60"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon={Globe} text="No referrer data yet" />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.35}>
          <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-purple-400" />
                Top Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.topProjects && data.topProjects.length > 0 ? (
                <div className="space-y-2.5">
                  {data.topProjects.map((p, i) => {
                    const maxClicks = data.topProjects[0]?.clicks || 1;
                    return (
                      <ProgressBar
                        key={p.projectId}
                        value={p.clicks}
                        max={maxClicks}
                        label={p.name}
                        count={p.clicks}
                        color={i === 0 ? "from-purple-500 to-pink-500" : "from-purple-500/60 to-pink-500/60"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon={FolderKanban} text="No project clicks yet" />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="border-theme-border bg-theme-card backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recentEvents && data.recentEvents.length > 0 ? (
                <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                  {data.recentEvents.map((e) => (
                    <div key={e.id} className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <EventIcon event={e.event} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-theme-text-secondary truncate">{formatEventLabel(e.event)}</p>
                        {e.path && <p className="text-[10px] text-theme-muted truncate">{e.path}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-theme-muted">{formatTimeAgo(e.createdAt)}</p>
                        {e.device && <p className="text-[10px] text-theme-muted">{e.device}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Clock} text="No activity yet" />
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex flex-col items-center py-8 text-theme-muted">
      <Icon className="h-8 w-8 mb-2 opacity-20" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
