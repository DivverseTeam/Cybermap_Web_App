import { CONTROL_STATUS_ENUM } from "~/lib/constants/controls";
import { getUserDetails, listUsers } from "../common";

async function evaluate() {
  try {
    // Fetch all users
    const users = await listUsers();

    if (!users || !users.value || users.value.length === 0) {
      return "Not implemented";
    }

    // Check for users who should be deactivated
    const inactiveUsers = [];

    for (const user of users.value) {
      if (!user.id) continue;
      // Get the user details
      const userDetails = await getUserDetails(user.id);

      // Check if the user is inactive
      const accountEnabled = userDetails.value.accountEnabled;
      const lastSignInDate =
        userDetails.value.signInActivity?.lastSignInDateTime;

      if (!accountEnabled || !lastSignInDate) {
        inactiveUsers.push(user);
      }
    }

    // Determine the status based on the findings
    if (inactiveUsers.length === 0) {
      return CONTROL_STATUS_ENUM.FULLY_IMPLEMENTED;
    } else if (inactiveUsers.length < users.value.length) {
      return CONTROL_STATUS_ENUM.PARTIALLY_IMPLEMENTED;
    } else {
      return CONTROL_STATUS_ENUM.NOT_IMPLEMENTED;
    }
  } catch (error) {
    console.error("Error while fetching user data:", error);
    throw new Error("Failed to evaluate the control requirement.");
  }
}

async function getHumanResourceSecurityEvidence() {
  return evaluate();
}

export { getHumanResourceSecurityEvidence };
