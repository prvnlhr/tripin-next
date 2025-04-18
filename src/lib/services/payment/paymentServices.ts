const BASE_URL: string =
  process.env.NEXT_PUBLIC_VERCEL_URL || "https://tripin-next.vercel.app";

export async function paymentInitiate(amount: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/stripe/create-payment-intents`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
