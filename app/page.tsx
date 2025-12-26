import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  console.log("Home page token:", token?.value);

  if (!token) {
    return redirect("/dashboard");
  }

  return redirect("/dashboard");
}
