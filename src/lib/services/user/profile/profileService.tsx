const BASE_URL: string =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type RiderProfileData = {
  name: string;
  phone: string;
};

// Fetch rider profile data (unchanged)
export async function fetchRiderProfile(userId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/user/profile?userId=${userId}`,
      {
        next: { tags: ["profile"] },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Fetch Profile Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to fetch profile."
      );
    }

    return result.data;
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    throw error; // Re-throw to let components handle
  }
}

// Create new rider profile (updated)
export async function createRiderProfile(
  userId: string,
  profileData: RiderProfileData
) {
  console.log(" userId:", userId);
  console.log(" profileData:", profileData);
  try {
    const response = await fetch(`${BASE_URL}/api/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name: profileData.name,
        phone: profileData.phone,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Create Profile Error:", result.error || result.message);
      throw new Error(
        result.error || result.message || "Failed to create profile."
      );
    }

    return result.data;
  } catch (error) {
    console.error("Create Profile Error:", error);
    throw error;
  }
}

// Check if profile is complete (simplified)
export async function checkRiderProfileComplete(userId: string) {
  try {
    const profile = await fetchRiderProfile(userId);
    return !!profile?.name && !!profile?.phone;
  } catch (error) {
    console.error("Profile Check Error:", error);
    return false;
  }
}
