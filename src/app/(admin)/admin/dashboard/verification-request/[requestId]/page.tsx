import VerificationRequestPage from "@/components/Admin/Pages/VerificationRequestPage/VerificationRequestPage";
import { getVerificationRequestDetails } from "@/lib/services/admin/verificationRequestServices";

type Params = Promise<{ requestId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { requestId } = await params;
  const verificationRequestDetails =
    await getVerificationRequestDetails(requestId);

  return (
    <VerificationRequestPage
      verificationRequestDetails={verificationRequestDetails}
    />
  );
};

export default page;
