import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

/* =======================
   AUTH HELPER
======================= */
function getAuthUser(req: Request): { id: number; role: string } | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("auth_token="))
    ?.replace("auth_token=", "");

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };
  } catch {
    return null;
  }
}

/* =======================
   UPDATE USER
======================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 🔑 REQUIRED FIX

    // const auth = getAuthUser(req);
    // if (!auth) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    const allowedProofTypes = ["AADHAR", "PAN"];
    if (!allowedProofTypes.includes(body.proofType)) {
      return NextResponse.json(
        { message: "Invalid proofType" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: Number(id) }, // ✅ now defined
      data: {
        fullName: body.fullName,
        mobile: body.mobile,
        email: body.email || null,
        proofType: body.proofType,
        proofNumber: body.proofNumber,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE USER
======================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 🔑 REQUIRED FIX

    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (auth.role === "AGENT") {
      return NextResponse.json(
        { message: "Agents cannot delete users" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id: Number(id) }, // ✅ now defined
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
