import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Condition, ListingStatus } from "@prisma/client";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
    status: z.nativeEnum(ListingStatus).optional(),
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).nullable().optional(),
    condition: z.nativeEnum(Condition).optional(),
    price: z.number().min(0).max(100_000).optional(),
});

/**
 * GET /api/listings/:id
 *
 * Returns a single listing including its associated messages.
 * Messages are visible publicly so that potential contacts can review the thread.
 */
export async function GET(_req: Request, { params }: Params) {
    const { id } = await params;

    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, image: true } },
                messages: {
                    include: {
                        sender: { select: { id: true, name: true, image: true } },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        return NextResponse.json(listing);
    } catch (error) {
        console.error("[GET /api/listings/:id]", error);
        return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 });
    }
}

/**
 * PATCH /api/listings/:id
 *
 * Partially updates a listing. Only the authenticated owner may modify it.
 * Updatable fields: `status`, `title`, `description`, `condition`, `price`.
 */
export async function PATCH(request: Request, { params }: Params) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    try {
        const existing = await prisma.listing.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }
        if (existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { status, title, description, condition, price } = parsed.data;

        const updated = await prisma.listing.update({
            where: { id },
            data: {
                ...(status !== undefined && { status }),
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(condition !== undefined && { condition }),
                ...(price !== undefined && { price }),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[PATCH /api/listings/:id]", error);
        return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
    }
}


/**
 * DELETE /api/listings/:id
 *
 * Permanently deletes a listing. Only the authenticated owner may delete it.
 * Cascades to associated messages in the database.
 */
export async function DELETE(_req: Request, { params }: Params) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const existing = await prisma.listing.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }
        if (existing.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.listing.delete({ where: { id } });
        return NextResponse.json({ message: "Listing deleted" });
    } catch (error) {
        console.error("[DELETE /api/listings/:id]", error);
        return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
    }
}
