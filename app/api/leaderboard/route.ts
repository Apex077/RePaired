import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch top users with their listing counts
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            points: true,
            listings: {
                select: {
                    status: true,
                },
            },
        },
        orderBy: [
            { points: "desc" },
        ],
        take: 50,
    });

    // Compute a derived score: points + (listings * 10) + (REPAIRED * 25)
    const ranked = users
        .map((u) => {
            const listingBonus = u.listings.length * 10;
            const repairedBonus = u.listings.filter((l) => l.status === "REPAIRED").length * 25;
            const score = u.points + listingBonus + repairedBonus;
            return {
                id: u.id,
                name: u.name,
                image: u.image,
                score,
                listingCount: u.listings.length,
                repairedCount: u.listings.filter((l) => l.status === "REPAIRED").length,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

    return NextResponse.json({ leaderboard: ranked, currentUserId: session.user.id });
}
