import CheckoutForm from "@/components/ChekoutForm";
import { stripe } from "../../../../../../../lib/stripe";
export default async function IndexPage() {
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: 500 * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return (
    <div id="checkout">
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  );
}
