import bcrypt from "bcrypt";
import User from "~/server/models/User";

export const signIn = async ({
	email,
	password,
}: { email: string; password: string }) => {
	const user = await User.findOne({ email });

	const isPasswordCorrect = user?.get("password")
		? bcrypt.compareSync(password, user.get("password"))
		: false;

	if (!user || !isPasswordCorrect) {
		throw new Error("Invalid email or password");
	}

	return user.toObject();
};
