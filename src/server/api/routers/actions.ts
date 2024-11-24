import User, { User as UserSchema } from "~/server/models/User";
import { Resource } from "sst";
import { jwtDecode } from "jwt-decode";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  type AttributeType,
  SignUpCommand,
  UsernameExistsException,
  AdminConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { SignInProps, SignUpProps } from "./user";
import { mongoosePromise } from "~/server/db";
import { useAuth } from "~/context/AuthContext";

const cognitoClient = new CognitoIdentityProviderClient();
await mongoosePromise;

export const signUp = async (props: SignUpProps) => {
  try {
    const { name, email, role, password } = props;

    const attributes: Array<AttributeType> = [
      {
        Name: "email",
        Value: email,
      },
    ];

    const signupOutput = await cognitoClient.send(
      new SignUpCommand({
        ClientId: Resource["user-client"].id,
        Username: email,
        Password: password,
        UserAttributes: attributes,
      })
    );

    await cognitoClient.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: Resource.user.id,
        Username: email,
      })
    );

    let user = await User.create({
      name,
      email,
      role,
      cognitoId: signupOutput.UserSub,
    });

    user = user.toJSON();

    return UserSchema.parse(user);
  } catch (error) {
    console.log(error);
    if (error instanceof UsernameExistsException) {
      throw new Error("Email already exists");
    } else {
      throw error;
    }
  }
};

export const signIn = async (props: SignInProps) => {
  const { setToken } = useAuth();

  try {
    const { email, password } = props;

    const initiateAuthOutput = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: Resource["user-client"].id,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
    );

    if (!initiateAuthOutput || !initiateAuthOutput.AuthenticationResult) {
      throw new Error("Invalid email or password");
    }

    const { sub: cognitoId }: { sub: string } = jwtDecode(
      initiateAuthOutput?.AuthenticationResult?.IdToken || ""
    );

    let user = await User.findOne({ cognitoId });

    if (!user) {
      throw new Error("User not found");
    }

    user = user.toJSON();

    // Extract the token from the response
    const token = initiateAuthOutput.AuthenticationResult?.AccessToken;

    setToken(token);

    return UserSchema.parse(user);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
