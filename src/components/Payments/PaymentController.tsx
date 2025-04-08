import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "./StripePaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { paymentInitiate } from "@/lib/services/payment/paymentServices";
import LoadingSpinner from "../Common/Spinner/LoadingSpinner";
import { useToast } from "@/context/ToastContext"; // Import your toast context

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentControllerProps {
  amount: number;
  onPaymentSuccess: () => void;
}

export const PaymentController = ({
  amount,
  onPaymentSuccess,
}: PaymentControllerProps) => {
  const router = useRouter();
  const { showToast, dismissToast } = useToast(); // Get toast function
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [initiatingForm, setInitiatingForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastIdRef = useRef<string | number>("");

  const handlePaymentInitiated = async () => {
    setInitiatingForm(true);
    try {
      const response = await paymentInitiate(amount);
      const { clientSecret } = response;
      setClientSecret(clientSecret);
      setShowForm(true);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    } finally {
      setInitiatingForm(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setShowForm(false);
    setIsProcessing(true);

    // Show success toast
    const toastId = showToast({
      type: "loading",
      title: "Payment Successful",
      description: "Redirecting to your trip...",
      persistent: false,
      duration: 3000,
      showCloseButton: true,
      style: {
        background: "#ECFDF5",
        color: "#065F46",
        borderColor: "#A7F3D0",
        iconColor: "#A7F3D0",
      },
    });

    toastIdRef.current = toastId;

    try {
      // 1.Call finish ride which make api request to backend to complete the payment
      onPaymentSuccess();

      // 2. Wait for 3 secs
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 3. dismiss the toast
      dismissToast(toastIdRef.current);

      // 4. redirect
      router.push("/user/trip/book-ride");
    } catch (error) {
      console.error("Error completing ride:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Could not complete ride",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setClientSecret("");
  };

  return (
    <div className="w-[100%] h-auto flex border-red-500 md:p-[5px]">
      {!showForm ? (
        <button
          onClick={handlePaymentInitiated}
          disabled={isProcessing}
          className={`
           w-full h-[40px] flex items-center justify-center bg-[#B5E4FC] cursor-pointer
           border border-[#3C3C3C]
           rounded
           hover:bg-[#E0F2FE] hover:ring-1
           transition-colors duration-200
           ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
       `}
        >
          {initiatingForm || isProcessing ? (
            <LoadingSpinner />
          ) : (
            <p className="font-medium text-[0.9rem] text-black">
              Make Payment INR - ${amount}
            </p>
          )}
        </button>
      ) : clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                borderRadius: "5px 5px 5px 5px",
                colorPrimary: "#B5E4FC",
                colorBackground: "#202325",
                colorText: "#ffffff",
                colorDanger: "#df1b41",
                fontFamily: "Lufga, system-ui, sans-serif",
              },
              rules: {
                ".Label": {
                  fontSize: "0.7rem",
                },
                ".Input": {
                  fontSize: "0.8rem",
                },
              },
            },
          }}
        >
          <StripePaymentForm
            clientSecret={clientSecret}
            amount={amount}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      ) : (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};
