import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Condition, ListingType, Side } from "@prisma/client";

/**
 * GET /api/listings
 *
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

/**
 * POST /api/listings
 *
 * Creates a new listing for the authenticated user.
 * Required body fields: `title`, `type`, `product`, `condition`, `latitude`, `longitude`.
 * Optional body fields: `description`, `side`, `images`.
 */
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, type, product, condition, side, latitude, longitude, images } = body;

        if (!title || !type || !product || !condition || latitude == null || longitude == null) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const listingType: ListingType =
            (type as string).toUpperCase() === "CASE" ? ListingType.CASE : ListingType.BUD;

        const listingCondition = (condition as string)
            .toUpperCase()
            .replace(" ", "_") as Condition;

        const listingSide: Side | null = side
            ? ((side as string).toUpperCase() as Side)
            : null;

        const listing = await prisma.listing.create({
            data: {
                userId: session.user.id,
                title,
                description: description ?? null,
                type: listingType,
                product,
                condition: listingCondition,
                side: listingSide,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                images: images ?? [],
            },
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        console.error("[POST /api/listings]", error);
        return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
    }
}
