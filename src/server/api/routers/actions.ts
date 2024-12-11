import UserModel, { User } from "~/server/models/User";
import { Resource } from "sst";
import { jwtDecode } from "jwt-decode";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  type AttributeType,
  SignUpCommand,
  UsernameExistsException,
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { SignInProps, SignUpProps } from "./user";
import { mongoosePromise } from "~/server/db";

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
      }),
    );

    await Promise.all([
      cognitoClient.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: Resource.user.id,
          Username: email,
        }),
      ),
      cognitoClient.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: Resource.user.id,
          Username: email,
          UserAttributes: [
            {
              Name: "email_verified",
              Value: "true",
            },
          ],
        }),
      ),
    ]);

    const user = await UserModel.create({
      name,
      email,
      role,
      cognitoId: signupOutput.UserSub,
    });

    return User.parse(user);
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      throw new Error("Email already exists");
    } else {
      throw error;
    }
  }
};

export const signIn = async (props: SignInProps) => {
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
      }),
    );

    if (!initiateAuthOutput || !initiateAuthOutput.AuthenticationResult) {
      throw new Error("Invalid email or password");
    }

    const { sub: cognitoId }: { sub: string } = jwtDecode(
      initiateAuthOutput?.AuthenticationResult?.IdToken || "",
    );

    const user = await UserModel.findOne({ cognitoId });

    if (!user) {
      throw new Error("User not found");
    }

    return User.parse(user);
  } catch (error) {
    throw error;
  }
};
