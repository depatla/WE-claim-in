import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ insuranceId: string }> }
) {
  const { insuranceId } = await params;
  const body = await req.json();

  const nominee = await prisma.nominee.create({
    data: {
      nomineeName: body.nomineeName,
      mobile: body.mobile,
      relation: body.relation,
      insuranceId: Number(insuranceId),
    },
  });

  return NextResponse.json({ nominee }, { status: 201 });
}
