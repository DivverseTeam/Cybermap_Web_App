// import argon2 from "argon2";
import bcryptjs from "bcryptjs";
import User, { User as UserSchema } from "~/server/models/User";

export const signIn = async ({
  email,
  password,
}: { email: string; password: string }) => {
  let user = await User.findOne({ email });

  const isPasswordCorrect = user?.get("password")
    ? bcryptjs.compareSync(password, user.get("password"))
    : false;

  if (!user || !isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  user = user.toJSON();

  return UserSchema.parse(user);
};
