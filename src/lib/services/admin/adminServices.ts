const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Getting Admin's Dashboard content Data
export async function getDashboardContent() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["adminDashboard"],
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Get Dashboard Content Error:",
        result.error || result.message
      );
      throw new Error(
        result.error || result.message || "Failed to fetch dashboard content"
      );
    }

    console.log("Get Dashboard Content Success:", result.message);
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Get Dashboard Content Error:", error);
    throw new Error(`Failed to fetch dashboard content: ${err.message}`);
  }
}
