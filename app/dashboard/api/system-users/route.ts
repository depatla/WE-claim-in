import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* =========================
   GET SYSTEM USERS
========================= */
export async function GET() {
  try {
    const users = await prisma.systemUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("GET SYSTEM USERS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch system users" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE SYSTEM USER
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.systemUser.create({
      data: {
        name: body.name,
        email: body.email || null,
        password: body.password || "Temp@123", // temporary
        role: body.role, // ADMIN | AGENT
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("CREATE SYSTEM USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to create system user" },
      { status: 500 }
    );
  }
}
