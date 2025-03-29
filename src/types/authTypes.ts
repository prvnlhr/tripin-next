export type AuthResponse =
  | { success: true; message: string }
  | {
      success: false;
      errorType: "WRONG_ROLE";
      correctRole: "rider" | "driver" | "admin";
      correctPortal: string;
    }
  | { success: false; errorType: "GENERIC_ERROR"; message: string };
