import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    if (!cookie) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("auth_token="))
      ?.replace("auth_token=", "");

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await prisma.systemUser.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      return new Response("Unauthorized", { status: 401 });
    }

    return Response.json({ user });
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }
}
