import { createClient } from "@/utils/supabase/server";

interface CodeSearchParams {
  token_hash?: string;
  type?: string;
}

type SearchParams = Promise<CodeSearchParams>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const supabase = await createClient();
  const { token_hash, type } = await searchParams;
  console.log(" type:", type);
  console.log(" token_hash:", token_hash);
  const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
  console.log(" data:", data);
  console.log(" error:", error);
  return <div className="w-screen h-screen">page</div>;
};

export default page;
