import { SubscriptionClient } from "@azure/arm-subscriptions";
import { ResourceManagementClient } from "@azure/arm-resources";
import { PolicyClient } from "@azure/arm-policy";
import { DefaultAzureCredential } from "@azure/identity";
import { Client, type Options } from "@microsoft/microsoft-graph-client";

const accessToken =
  "eyJ0eXAiOiJKV1QiLCJub25jZSI6IlhWd1QyRnpKRU1UNmdVRXBVaDJXWVU3blRvbGlJTmk4WE40bk9TWlRpbjQiLCJhbGciOiJSUzI1NiIsIng1dCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCIsImtpZCI6Inp4ZWcyV09OcFRrd041R21lWWN1VGR0QzZKMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC80NjFhMGM1NC03NWM2LTQ1ODYtOGI1Ny1mZjYyNzVmNDc2NDQvIiwiaWF0IjoxNzMyMDE0OTU4LCJuYmYiOjE3MzIwMTQ5NTgsImV4cCI6MTczMjAyMDQ5NSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFXUUFtLzhZQUFBQXhrUW5WZytUdmFvZjYrdFJJNE4yQi84NW5abE1hVmF5aTB4TnNYdS9Kc2NTbTNkVmRKT2ROOGYxUThVeUkrMnF6bXQxdDluOUxDeTluc0thd2ZZdXkxSkc4YWJ4NEIzbXBUUUozNTU2NG1NY1lxTVlrU3o4eVhjQjIvU1lHeEdpIiwiYWx0c2VjaWQiOiIxOmxpdmUuY29tOjAwMDY0MDAwQ0MyQkY3OTkiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkN5YmVybWFwIERldiIsImFwcGlkIjoiMzM3YzMxZTctMjIzZC00ZjkxLWI2NDAtZTA3YmE0MzNlMWYwIiwiYXBwaWRhY3IiOiIxIiwiZW1haWwiOiJqYW5vbnltb3Vzb25lQGhvdG1haWwuY28udWsiLCJmYW1pbHlfbmFtZSI6IkFmb2xhYmkiLCJnaXZlbl9uYW1lIjoiSm9obiIsImlkcCI6ImxpdmUuY29tIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMzUuMjQxLjE3OS42MyIsIm5hbWUiOiJKb2huIEFmb2xhYmkiLCJvaWQiOiIyYWNmZjU2ZC02MDAxLTQ0MzItOTZhMC1hOTQ4MmNmNDY3ZTMiLCJwbGF0ZiI6IjUiLCJwdWlkIjoiMTAwMzIwMDNGM0ZDQzRGNCIsInJoIjoiMS5BUk1CVkF3YVJzWjFoa1dMVl85aWRmUjJSQU1BQUFBQUFBQUF3QUFBQUFBQUFBQVVBV1lUQVEuIiwic2NwIjoiQXVkaXRMb2cuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWQuQWxsIFVzZXIuUmVhZCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ino0Mm0tZS1TZHB3WUZudVZtbW5mdGdZbFVHLS1GWWFtUlphQUw5Nzk0RVUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQUYiLCJ0aWQiOiI0NjFhMGM1NC03NWM2LTQ1ODYtOGI1Ny1mZjYyNzVmNDc2NDQiLCJ1bmlxdWVfbmFtZSI6ImxpdmUuY29tI2phbm9ueW1vdXNvbmVAaG90bWFpbC5jby51ayIsInV0aSI6IlFLLVhSc0tJX0VxMnRrSWRXZ2N3QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDI0IiwieG1zX3N0Ijp7InN1YiI6IkZMQ2JKS1Q5NDhNcEpRRHNVM2JaUnp4RDZ1blVyOGZLQkoyLXJzTkhQQTgifSwieG1zX3RjZHQiOjE3MzA4OTcwNjF9.FYMxuzRKga7RvVA2GcfZhmNKS71H8qcHRVHlsGBREoCALRADSErbGsAqoIwCI054ws320O7PpWQODCWKT5gJX51M2NOuFi0Lm5ZHHgH3dg6PPhId5ROD-xsgOWqulMZwXo_jpBdzq5rYYLVwWm8g6dHCaqcmRStX38yUdCQRU7U61S2nd7HabDaJcjD39Xn_jXIZBV8M1PC8nuSs6E0fR5MF3kp3wiM6UsYNjmdZzQX8PjJ2XTuHNo5ndTI3HjFdjrXKxR-O9xI8GYotqf2mqg8MC_c2xDy5IQ-CrJCwfYodO3RAo1pWY4Rl1nJdChRJrcvW7iUFDH8G252joqm1-Q";

const options: Options = {
  authProvider: (done) => {
    done(null, accessToken);
  },
};

const azureClient = Client.init(options);

const credential = new DefaultAzureCredential();
const subscriptionId = "461a0c54-75c6-4586-8b57-ff6275f47644";

const subscriptionClient = new SubscriptionClient(credential);
const policyClient = new PolicyClient(credential);
const resourceClient = new ResourceManagementClient(credential, subscriptionId);

export {
  azureClient,
  subscriptionClient,
  policyClient,
  credential,
  resourceClient,
};