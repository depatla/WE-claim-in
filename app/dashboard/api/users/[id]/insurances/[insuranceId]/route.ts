import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/* ================= UPDATE INSURANCE ================= */

export async function PUT(
  req: Request,
  context: { params: Promise<{ insuranceId: string }> }
) {
  try {
    const { insuranceId } = await context.params;
    const id = Number(insuranceId);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid insuranceId" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      companyName,
      insuranceNumber,
      insuranceType,
      insuranceFromDate,
      insuranceToDate,
      insuranceAmount,
    } = body;

    /* ---------- VALIDATION ---------- */

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
        { message: "To date must be after From date" },
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

    /* ---------- UPDATE ---------- */

    const insurance = await prisma.insurance.update({
      where: { id },
      data: {
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

    return NextResponse.json({ insurance });
  } catch (error) {
    console.error("UPDATE_INSURANCE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ================= DELETE INSURANCE ================= */

export async function DELETE(
  req: Request,
  context: { params: Promise<{ insuranceId: string }> }
) {
  try {
    const { insuranceId } = await context.params;
    const id = Number(insuranceId);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid insuranceId" },
        { status: 400 }
      );
    }

    /* ---------- DELETE NOMINEES FIRST ---------- */
    await prisma.nominee.deleteMany({
      where: { insuranceId: id },
    });

    /* ---------- DELETE INSURANCE ---------- */
    await prisma.insurance.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_INSURANCE_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
