import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

/* ---------------- AUTH HELPER ---------------- */
function getUserIdFromRequest(req: Request): number | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("auth_token="))
    ?.replace("auth_token=", "");

  if (!token) return null;

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: number;
  };

  return payload.id;
}

/* ---------------- GET USERS ---------------- */
export async function GET(req: Request) {
  console.log("Fetching users");
  try {
    // const userId = getUserIdFromRequest(req);

    // console.log("Authenticated user ID:", userId);
    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/* ---------------- CREATE USER ---------------- */
export async function POST(req: Request) {
  try {
    console.log("Creating new user");
    // const userId = getUserIdFromRequest(req);
    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();

    console.log("Creating user:", body);

    const allowedProofTypes = ["AADHAR", "PAN"]; // update to match your Prisma enum
    if (body.proofType && !allowedProofTypes.includes(body.proofType)) {
      return NextResponse.json(
        {
          message:
            "Invalid proofType. Allowed: " + allowedProofTypes.join(", "),
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        fullName: body.fullName,
        mobile: body.mobile,
        email: body.email || null,
        proofType: body.proofType, // "AADHAR" | "PAN"
        proofNumber: body.proofNumber,
        createdById: 1, // TODO: from JWT later
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
