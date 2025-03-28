import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const { code } = params;
  console.log(" code:", code);

  if (!code) {
    return redirect("/user/auth?error=No code provided");
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  console.log(" exchangeCodeForSession->data:", data);
  if (error) {
    console.error("Exchange code error:", error);
    return redirect("/user/auth?error=Invalid link");
  }

  return redirect("/user/trip/book-ride");
}
