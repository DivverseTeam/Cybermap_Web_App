import { runIso27001 } from "./server/api/routers/controls/iso27001";

export const AppRoutes = {
  AUTH: {
    LOGIN: "/signin",
    REGISTER: "/signup",
    ONBOARDING: "/onboarding",
    RESET_PASSWORD: "/reset-password",
    FORGOT_PASSWORD: "/forgot-password",
  },
};

runIso27001();