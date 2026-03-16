import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uid = session.user.id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const prevThirtyStart = new Date(thirtyDaysAgo);
    prevThirtyStart.setDate(prevThirtyStart.getDate() - 30);

    const [
      totalViews,
      totalClicks,
      viewsLast30,
      viewsPrev30,
      clicksLast30,
      clicksPrev30,
      rawViewsLast30,
      thisWeekViews,
      topReferrers,
      deviceBreakdown,
      browserBreakdown,
      recentEvents,
      topProjects,
    ] = await Promise.all([
      prisma.analytics.count({ where: { userId: uid, event: "page_view" } }),
      prisma.analytics.count({ where: { userId: uid, event: "project_click" } }),
      prisma.analytics.count({ where: { userId: uid, event: "page_view", createdAt: { gte: thirtyDaysAgo } } }),
      prisma.analytics.count({ where: { userId: uid, event: "page_view", createdAt: { gte: prevThirtyStart, lt: thirtyDaysAgo } } }),
      prisma.analytics.count({ where: { userId: uid, event: "project_click", createdAt: { gte: thirtyDaysAgo } } }),
      prisma.analytics.count({ where: { userId: uid, event: "project_click", createdAt: { gte: prevThirtyStart, lt: thirtyDaysAgo } } }),
      prisma.analytics.findMany({
        where: { userId: uid, event: "page_view", createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.analytics.count({ where: { userId: uid, event: "page_view", createdAt: { gte: sevenDaysAgo } } }),
      prisma.analytics.groupBy({
        by: ["referrer"],
        where: { userId: uid, referrer: { not: null } },
        _count: true,
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),
      prisma.analytics.groupBy({
        by: ["device"],
        where: { userId: uid, device: { not: null } },
        _count: true,
        orderBy: { _count: { device: "desc" } },
      }),
      prisma.analytics.groupBy({
        by: ["browser"],
        where: { userId: uid, browser: { not: null } },
        _count: true,
        orderBy: { _count: { browser: "desc" } },
      }),
      prisma.analytics.findMany({
        where: { userId: uid },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, event: true, path: true, referrer: true, device: true, browser: true, createdAt: true, projectId: true },
      }),
      prisma.analytics.groupBy({
        by: ["projectId"],
        where: { userId: uid, event: "project_click", projectId: { not: null } },
        _count: true,
        orderBy: { _count: { projectId: "desc" } },
        take: 10,
      }),
    ]);

    // Build views-by-day chart data (fill in zero days)
    const viewsByDayMap: Record<string, number> = {};
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      viewsByDayMap[d.toISOString().split("T")[0]] = 0;
    }
    for (const v of rawViewsLast30) {
      const day = v.createdAt.toISOString().split("T")[0];
      viewsByDayMap[day] = (viewsByDayMap[day] || 0) + 1;
    }
    const viewsByDay = Object.entries(viewsByDayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // Resolve project names for top clicked projects
    const projectIds = topProjects.map(p => p.projectId).filter(Boolean) as string[];
    const projectNames = projectIds.length > 0
      ? await prisma.project.findMany({ where: { id: { in: projectIds } }, select: { id: true, title: true } })
      : [];
    const nameMap = Object.fromEntries(projectNames.map(p => [p.id, p.title]));

    const viewsTrend = viewsPrev30 === 0 ? (viewsLast30 > 0 ? 100 : 0) : Math.round(((viewsLast30 - viewsPrev30) / viewsPrev30) * 100);
    const clicksTrend = clicksPrev30 === 0 ? (clicksLast30 > 0 ? 100 : 0) : Math.round(((clicksLast30 - clicksPrev30) / clicksPrev30) * 100);

    return NextResponse.json({
      totalViews,
      totalClicks,
      viewsLast30,
      clicksLast30,
      viewsTrend,
      clicksTrend,
      thisWeekViews,
      viewsByDay,
      topReferrers: topReferrers.map(r => ({ referrer: r.referrer || "Direct", count: r._count })),
      deviceBreakdown: deviceBreakdown.map(d => ({ device: d.device || "Unknown", count: d._count })),
      browserBreakdown: browserBreakdown.map(b => ({ browser: b.browser || "Unknown", count: b._count })),
      topProjects: topProjects.map(p => ({ projectId: p.projectId, name: nameMap[p.projectId!] || "Unknown", clicks: p._count })),
      recentEvents: recentEvents.map(e => ({
        id: e.id,
        event: e.event,
        path: e.path,
        referrer: e.referrer,
        device: e.device,
        browser: e.browser,
        createdAt: e.createdAt.toISOString(),
        projectId: e.projectId,
      })),
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, event, path, referrer, projectId } = body;

    if (!userId || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";
    const device = /mobile/i.test(userAgent) ? "Mobile" : /tablet/i.test(userAgent) ? "Tablet" : "Desktop";
    const browser = userAgent.includes("Edge")
      ? "Edge"
      : userAgent.includes("Chrome")
      ? "Chrome"
      : userAgent.includes("Firefox")
      ? "Firefox"
      : userAgent.includes("Safari")
      ? "Safari"
      : "Other";

    await prisma.analytics.create({
      data: { userId, event, path, referrer, device, browser, projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
