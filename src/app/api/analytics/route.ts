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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalViews, totalClicks, viewsByDay, topReferrers, deviceBreakdown, browserBreakdown] =
      await Promise.all([
        prisma.analytics.count({
          where: { userId: session.user.id, event: "page_view" },
        }),
        prisma.analytics.count({
          where: { userId: session.user.id, event: "project_click" },
        }),
        prisma.analytics.groupBy({
          by: ["createdAt"],
          where: {
            userId: session.user.id,
            event: "page_view",
            createdAt: { gte: thirtyDaysAgo },
          },
          _count: true,
        }),
        prisma.analytics.groupBy({
          by: ["referrer"],
          where: { userId: session.user.id, referrer: { not: null } },
          _count: true,
          orderBy: { _count: { referrer: "desc" } },
          take: 10,
        }),
        prisma.analytics.groupBy({
          by: ["device"],
          where: { userId: session.user.id, device: { not: null } },
          _count: true,
        }),
        prisma.analytics.groupBy({
          by: ["browser"],
          where: { userId: session.user.id, browser: { not: null } },
          _count: true,
        }),
      ]);

    return NextResponse.json({
      totalViews,
      totalClicks,
      viewsByDay: viewsByDay.map((v) => ({
        date: v.createdAt.toISOString().split("T")[0],
        count: v._count,
      })),
      topReferrers: topReferrers.map((r) => ({
        referrer: r.referrer || "Direct",
        count: r._count,
      })),
      deviceBreakdown: deviceBreakdown.map((d) => ({
        device: d.device || "Unknown",
        count: d._count,
      })),
      browserBreakdown: browserBreakdown.map((b) => ({
        browser: b.browser || "Unknown",
        count: b._count,
      })),
    });
  } catch (error) {
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
    const browser = userAgent.includes("Chrome")
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
