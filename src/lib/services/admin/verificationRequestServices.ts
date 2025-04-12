const BASE_URL: string =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://tripin-next.vercel.app";

// Admin requests the Drivers details
export async function getVerificationRequestDetails(requestId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/admin/verification-request/${requestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Error fetching verification request details:",
        result.error || result.message
      );
      throw new Error(
        result.error ||
          result.message ||
          "Failed to fetch verification request details."
      );
    }

    console.log(
      "Verification request details fetched successfully:",
      result.message
    );
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Error in fetching verification request details:", error);
    throw new Error(
      `Failed to fetch verification request details: ${err.message}`
    );
  }
}

// Admin verifies the Driver details
export async function updateVerificationRequest(
  requestId: string,
  approvalStatus: "approved" | "rejected",
  cabType?: string
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/admin/verification-request/${requestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approval_status: approvalStatus,
          ...(approvalStatus === "approved" && cabType
            ? { cab_type: cabType }
            : {}),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "Error updating verification request:",
        result.error || result.message
      );
      throw new Error(
        result.error ||
          result.message ||
          "Failed to update verification request."
      );
    }

    console.log(
      `Verification request ${approvalStatus} successfully:`,
      result.message
    );
    return result.data;
  } catch (error) {
    const err = error as Error;
    console.error("Error in updating verification request:", err.message);
    throw new Error(`Failed to update verification request: ${err.message}`);
  }
}
