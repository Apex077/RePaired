import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * GET /api/profile
 *
 * Returns the authenticated user's profile along with all their listings,
 * ordered by most recently created. Requires an active session.
 */
export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                listings: {
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        product: true,
                        condition: true,
                        status: true,
                        images: true,
                        createdAt: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[GET /api/profile]", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}
