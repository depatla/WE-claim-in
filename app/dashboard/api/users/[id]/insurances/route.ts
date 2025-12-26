import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/* ================= GET ================= */

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ MUST await

  const userId = Number(id);
  if (!userId || isNaN(userId)) {
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }

  /* ---------- USER ---------- */
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      mobile: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  /* ---------- INSURANCES ---------- */
  const insurances = await prisma.insurance.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      insuranceNumber: true,
      insuranceType: true,
      insuranceFromDate: true,
      insuranceToDate: true,
      insuranceAmount: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const insuranceIds = insurances.map((i) => i.id);

  /* ---------- NOMINEES ---------- */
  const nominees =
    insuranceIds.length > 0
      ? await prisma.nominee.findMany({
          where: {
            insuranceId: { in: insuranceIds },
          },
          select: {
            id: true,
            nomineeName: true,
            mobile: true,
            relation: true,
            insuranceId: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      : [];

  /* ---------- MERGE ---------- */
  const result = insurances.map((insurance) => ({
    ...insurance,
    nominees: nominees.filter((n) => n.insuranceId === insurance.id),
  }));

  return NextResponse.json({
    user,
    insurances: result,
  });
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      companyName,
      insuranceNumber,
      insuranceType,
      insuranceFromDate,
      insuranceToDate,
      insuranceAmount,
    } = body;

    /* ---------- VALIDATION ---------- */

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    if (
      !companyName ||
      !insuranceNumber ||
      !insuranceType ||
      !insuranceFromDate ||
      !insuranceToDate
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (new Date(insuranceToDate) <= new Date(insuranceFromDate)) {
      return NextResponse.json(
        { message: "Insurance To Date must be after From Date" },
        { status: 400 }
      );
    }

    if (
      insuranceAmount !== undefined &&
      insuranceAmount !== "" &&
      Number(insuranceAmount) <= 0
    ) {
      return NextResponse.json(
        { message: "Insurance amount must be greater than 0" },
        { status: 400 }
      );
    }

    /* ---------- CHECK USER ---------- */
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    /* ---------- CREATE INSURANCE ---------- */
    const insurance = await prisma.insurance.create({
      data: {
        userId: Number(userId),
        companyName: companyName.trim(),
        insuranceNumber: insuranceNumber.trim(),
        insuranceType: insuranceType.trim(),
        insuranceFromDate: new Date(insuranceFromDate),
        insuranceToDate: new Date(insuranceToDate),
        insuranceAmount:
          insuranceAmount && insuranceAmount !== ""
            ? new Prisma.Decimal(insuranceAmount)
            : null,
      },
    });

    return NextResponse.json({ success: true, insurance }, { status: 201 });
  } catch (error) {
    console.error("CREATE_INSURANCE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
