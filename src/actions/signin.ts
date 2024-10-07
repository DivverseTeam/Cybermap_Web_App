"use server";

import { SignInSchema } from "~/containers/auth/schemas";
import * as z from "zod";

export const signin = async (values: z.infer<typeof SignInSchema>) => {
  const validateFields = SignInSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email or password!" };
  }

  return { success: "Email sent!" };
};
