import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* UPDATE */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ nomineeId: string }> }
) {
  const { nomineeId } = await params;
  const body = await req.json();

  const nominee = await prisma.nominee.update({
    where: { id: Number(nomineeId) },
    data: {
      nomineeName: body.nomineeName,
      mobile: body.mobile,
      relation: body.relation,
    },
  });

  return NextResponse.json({ nominee });
}

/* DELETE */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ nomineeId: string }> }
) {
  const { nomineeId } = await params;

  await prisma.nominee.delete({
    where: { id: Number(nomineeId) },
  });

  return NextResponse.json({ success: true });
}
