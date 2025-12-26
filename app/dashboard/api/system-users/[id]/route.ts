import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* =========================
   UPDATE SYSTEM USER
========================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const user = await prisma.systemUser.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        email: body.email || null,
        role: body.role,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("UPDATE SYSTEM USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update system user" },
      { status: 500 }
    );
  }
}

/* =========================
   TOGGLE ACTIVE / INACTIVE
========================= */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const user = await prisma.systemUser.update({
      where: { id: Number(id) },
      data: {
        status: body.active ? "ACTIVE" : "INACTIVE",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("TOGGLE STATUS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  }
}
