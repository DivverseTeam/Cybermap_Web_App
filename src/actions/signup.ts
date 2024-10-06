"use server";

import bcrypt from "bcrypt";
import { SignUpSchema } from "~/containers/auth/schemas";
import * as z from "zod";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validateFields = SignUpSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email or password!" };
  }

  const { fullName, email, password } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  return { success: "Email sent!" };
};
