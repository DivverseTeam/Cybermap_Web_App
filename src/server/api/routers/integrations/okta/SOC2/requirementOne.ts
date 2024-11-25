// // Logical Access Controls (Security)
// // Access to systems and data must be restricted to authorized individuals based on least privilege.
// //Monitoring and logging of access changes and user activities are essential.

// import { oktaApi, TIME_FRAME } from "../init";

// // Function to get all users from Okta
// async function getAllUsers(query = "") {
//   try {
//     const response = await oktaApi.get(query ? `/users?${query}` : "/users");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// }

// // Function to get evidence for access restrictions, roles, and permissions for all users
// async function getAccessRestrictionsEvidenceForAllUsers() {
//   try {
//     const users = await getAllUsers();
//     const evidence = await Promise.all(
//       users.map(async (user: any) => {
//         try {
//           const [userInfo, userRoles] = await Promise.all([
//             oktaApi.get(`/users/${user.id}`),
//             oktaApi.get(`/users/${user.id}/roles`),
//           ]);
//           return {
//             userId: user.id,
//             userInfo: userInfo.data,
//             roles: userRoles.data,
//           };
//         } catch (error: any) {
//           console.error(`Error fetching data for user ${user.id}:`, error);
//           return { userId: user.id, error: error.message };
//         }
//       })
//     );
//     return evidence;
//   } catch (error) {
//     console.error(
//       "Error fetching access restrictions evidence for all users:",
//       error
//     );
//     throw error;
//   }
// }

// // Function to verify multi-factor authentication (MFA) setup for all users
// async function getMfaEvidence() {
//   try {
//     const users = await getAllUsers();
//     const mfaStatus = await Promise.all(
//       users.map(async (user: any) => {
//         try {
//           const factors = await oktaApi.get(`/users/${user.id}/factors`);
//           const mfaEnabled = factors.data.some((factor: any) =>
//             [
//               "sms",
//               "token:software:totp",
//               "push",
//               "webauthn",
//               "email",
//             ].includes(factor.factorType)
//           );
//           return {
//             userId: user.id,
//             mfaEnabled,
//             factors: factors.data,
//           };
//         } catch (error: any) {
//           console.error(`Error fetching MFA data for user ${user.id}:`, error);
//           return { userId: user.id, error: error.message };
//         }
//       })
//     );
//     return mfaStatus;
//   } catch (error) {
//     console.error("Error fetching MFA evidence:", error);
//     throw error;
//   }
// }

// // Function to get logs for user activity and security events
// async function getMonitoringAndLoggingEvidence(timeFrame: string) {
//   try {
//     const logs = await oktaApi.get("/logs", {
//       params: {
//         since: timeFrame,
//         filter: [
//           'eventType eq "user.session.start"',
//           'eventType eq "user.account.update"',
//           'eventType eq "user.authentication.failure"',
//           'eventType eq "security.policy.violation"',
//           'eventType eq "user.authentication.auth_via_mfa"',
//         ].join(" or "),
//       },
//     });
//     return logs.data;
//   } catch (error) {
//     console.error("Error fetching monitoring and logging evidence:", error);
//     throw error;
//   }
// }

// async function getAccessControlEvidence() {
//   try {
//     const accessEvidence = await getAccessRestrictionsEvidenceForAllUsers();
//     console.log("Access Restrictions Evidence for All Users:", accessEvidence);

//     const mfaEvidence = await getMfaEvidence();
//     console.log("MFA Evidence for All Users:", mfaEvidence);

//     const monitoringEvidence = await getMonitoringAndLoggingEvidence(
//       TIME_FRAME
//     );
//     console.log("Monitoring and Logging Evidence:", monitoringEvidence);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }

// export { getAccessControlEvidence };
