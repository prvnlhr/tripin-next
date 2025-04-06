"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const StripePaymentForm = ({
  //   clientSecret,
  amount,
  onPaymentSuccess,
  onCancel,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred");
    } else {
      onPaymentSuccess();
    }

    setIsLoading(false);
  };

  return (
    <div className="w-[100%] h-auto md:p-[10px] border-blue-600">
      <div className="w-full h-[40px] flex items-center text-[0.9rem] px-[5px] font-normal">
        Complete Payment -
        <span className="text-[#B5E4FC] ml-[5px]">₹ {amount}</span>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <PaymentElement options={{ layout: "accordion" }} />
        <div className="w-full flex space-x-3 mt-[5px] px-[2px]">
          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="cursor-pointer h-[40px] flex items-center justify-center flex-1 bg-[#B5E4FC] hover:bg-[#E0F2FE] py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Oval
                  visible={true}
                  color="#101828"
                  secondaryColor="#47494A"
                  strokeWidth="5"
                  ariaLabel="oval-loading"
                  wrapperClass="w-[15px] mr-[10px] flex items-center justify-center border-red-500"
                />
                <p className="text-[#101828] text-[0.8rem]">Processing...</p>
              </>
            ) : (
              <p className="text-[#101828] text-[0.8rem]">Pay Now</p>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer h-[40px] flex items-center justify-center flex-1 bg-[#47494A] text-white text-[0.8rem]  py-2 px-4 rounded hover:bg-[#7D7D7D]"
          >
            Cancel
          </button>
        </div>
        {message && <div className="text-red-500 text-sm">{message}</div>}
      </form>
    </div>
  );
};
