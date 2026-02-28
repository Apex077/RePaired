import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const messagePostSchema = z.object({
    listingId: z.string().min(1),
    receiverId: z.string().min(1),
    content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long (max 2000 chars)"),
});

/**
 * GET /api/messages?listingId=<id>
 *
 * Returns all messages in a listing's thread visible to the current user.
 * Only the sender, the receiver, or the listing owner may read the thread.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
        return NextResponse.json({ error: "listingId is required" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Only allow sender or receiver (or the listing owner) to read the thread
        const messages = await prisma.message.findMany({
            where: {
                listingId,
                OR: [
                    { senderId: session.user.id },
                    { receiverId: session.user.id },
                    { listing: { userId: session.user.id } },
                ],
            },
            include: {
                sender: { select: { id: true, name: true, image: true } },
                receiver: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("[GET /api/messages]", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

/**
 * POST /api/messages
 *
 * Sends a message from the authenticated user about a listing.
 * Required body fields: `listingId`, `receiverId`, `content`.
 * A user cannot send a message to themselves.
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

    const parsed = messagePostSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { listingId, receiverId, content } = parsed.data;

    // Prevent messaging yourself
    if (receiverId === session.user.id) {
        return NextResponse.json({ error: "Cannot send a message to yourself" }, { status: 400 });
    }

    try {
        // Verify listing exists
        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // Verify receiver is a real user
        const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
        if (!receiver) {
            return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                senderId: session.user.id,
                receiverId,
                listingId,
            },
            include: {
                sender: { select: { id: true, name: true, image: true } },
                receiver: { select: { id: true, name: true, image: true } },
            },
        });

        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("[POST /api/messages]", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
