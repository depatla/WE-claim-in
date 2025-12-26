import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* ============================
   USERS SEARCH (AUTOCOMPLETE)
============================ */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    // Do nothing until 3 chars
    if (q.length < 3) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            mobile: {
              contains: q,
            },
          },
        ],
      },
      select: {
        id: true,
        fullName: true,
        mobile: true,
      },
      take: 10,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("USER SEARCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to search users" },
      { status: 500 }
    );
  }
}
