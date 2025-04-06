import React from "react";
import { stripe } from "../lib/stripe";
import CheckoutForm from "./ChekoutForm";

const CheckoutBtn = async () => {
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return <CheckoutForm clientSecret={clientSecret} />;
};

export default CheckoutBtn;
