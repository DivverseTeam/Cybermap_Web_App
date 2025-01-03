import { jwtDecode } from "jwt-decode";
import { Resource } from "sst";
import UserModel, { User } from "~/server/models/User";
// import User, { User as UserSchema } from "~/server/models/User";

import {
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  UsernameExistsException,
  type AttributeType,
} from "@aws-sdk/client-cognito-identity-provider";
import { mongoosePromise } from "~/server/db";
import { globalConfig } from "./integrations/aws/init";
import type { SignInProps, SignUpProps } from "./user";

// Abiola
const cognitoClient = new CognitoIdentityProviderClient(globalConfig);
// const cognitoClient = new CognitoIdentityProviderClient();
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

    await Promise.all([
      cognitoClient.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: Resource.user.id,
          Username: email,
        })
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
        })
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

    console.log("initiateAuthOutput 1");
    // Abiola
    const initiateAuthOutput = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: "5935eo5ka6uqrnk46cq092htth",
        // ClientId: Resource["user-client"].id,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
    );

    // console.log("initiateAuthOutput 2", initiateAuthOutput);
    if (!initiateAuthOutput || !initiateAuthOutput.AuthenticationResult) {
      throw new Error("Invalid email or password");
    }

    const { sub: cognitoId }: { sub: string } = jwtDecode(
      initiateAuthOutput?.AuthenticationResult?.IdToken || ""
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
