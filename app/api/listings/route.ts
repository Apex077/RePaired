import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Condition, ListingType, ListingStatus, Side } from "@prisma/client";
import { z } from "zod";

// ── Validation schemas ────────────────────────────────────────────────────────

const listingPostSchema = z.object({
    title: z.string().min(1, "Title is required").max(120, "Title too long"),
    description: z.string().max(1000, "Description too long").optional(),
    type: z.enum(["CASE", "BUD", "case", "bud"]),
    product: z.string().min(1, "Product is required").max(100, "Product name too long"),
    condition: z.enum(["NEW", "GOOD", "FAIR", "FOR_PARTS", "New", "Good", "Fair", "For Parts"]),
    side: z.enum(["LEFT", "RIGHT", "BOTH"]).optional().nullable(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    images: z.array(z.string().url()).max(10).optional(),
});

const listingPatchSchema = z.object({
    status: z.nativeEnum(ListingStatus).optional(),
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional().nullable(),
    condition: z.nativeEnum(Condition).optional(),
    price: z.number().min(0).max(100_000).optional(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function normaliseType(raw: string): ListingType {
    return raw.toUpperCase() === "CASE" ? ListingType.CASE : ListingType.BUD;
}

function normaliseCondition(raw: string): Condition {
    const map: Record<string, Condition> = {
        NEW: Condition.NEW,
        GOOD: Condition.GOOD,
        FAIR: Condition.FAIR,
        FOR_PARTS: Condition.FOR_PARTS,
        "FOR PARTS": Condition.FOR_PARTS,
    };
    return map[raw.toUpperCase().replace(" ", "_")] ?? Condition.FAIR;
}

function normaliseSide(raw: string | null | undefined): Side | null {
    if (!raw) return null;
    const map: Record<string, Side> = {
        LEFT: Side.LEFT,
        RIGHT: Side.RIGHT,
        BOTH: Side.BOTH,
    };
    return map[raw.toUpperCase()] ?? null;
}

// ── GET /api/listings ─────────────────────────────────────────────────────────
/**
 * Returns all available listings. Supports optional query parameters:
 * - `type`    — Filter by listing type ("case" or "bud").
 * - `product` — Case-insensitive partial match on the product name.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");
    const product = searchParams.get("product");

    let type: ListingType | undefined;
    if (typeParam) {
        type = typeParam.toUpperCase() === "CASE" ? ListingType.CASE : ListingType.BUD;
    }

    try {
        const listings = await prisma.listing.findMany({
            where: {
                status: "AVAILABLE",
                ...(type && { type }),
                ...(product && { product: { contains: product, mode: "insensitive" } }),
            },
            include: {
                user: {
                    select: { id: true, name: true, image: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(listings);
    } catch (error) {
        console.error("[GET /api/listings]", error);
        return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
    }
}

// ── POST /api/listings ────────────────────────────────────────────────────────
/**
 * Creates a new listing for the authenticated user.
 * Required body fields: `title`, `type`, `product`, `condition`, `latitude`, `longitude`.
 * Optional body fields: `description`, `side`, `images`.
 */
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = listingPostSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { title, description, type, product, condition, side, latitude, longitude, images } =
        parsed.data;

    try {
        const listing = await prisma.listing.create({
            data: {
                userId: session.user.id,
                title,
                description: description ?? null,
                type: normaliseType(type),
                product,
                condition: normaliseCondition(condition),
                side: normaliseSide(side),
                latitude,
                longitude,
                images: images ?? [],
            },
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        console.error("[POST /api/listings]", error);
        return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
    }
}
