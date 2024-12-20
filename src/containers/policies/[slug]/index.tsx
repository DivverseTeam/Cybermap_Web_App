import type { FunctionComponent, ReactNode } from "react";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "~/app/_components/ui/card";
import { Checkbox } from "~/app/_components/ui/checkbox";
import { Input } from "~/app/_components/ui/input";
import { ProgressCircle } from "../components/ProgressCircle";

interface SinglePolicyProps {}

const SectionCard: FunctionComponent<{
  title: string;
  children: ReactNode;
}> = ({ title, children }) => (
  <Card>
    <CardHeader className="flex w-full flex-row items-center justify-between pb-2">
      <h4 className="font-semibold text-lg">{title}</h4>
      <Button variant="outline" size="sm">
        Edit section
      </Button>
    </CardHeader>
    <CardContent className="text-gray-600 text-sm">{children}</CardContent>
  </Card>
);

const SeverityContent = () => (
  <div className="flex flex-col gap-4">
    <p>
      <span className="cursor-pointer font-medium text-blue-600 hover:underline">
        {`Team or role responsible for monitoring reports of security incidents or events`}{" "}
      </span>
      shall monitor incident and event tickets and assign a ticket based on the
      following categories.
    </p>

    <div className="flex flex-col gap-4">
      <div>
        <h4 className="font-semibold leading-8">
          P2/P3 - Medium and Low Severity
        </h4>
        <p>
          Issues meeting this severity are simply suspicious or odd behaviors.
          They are not verified and require further investigation. There is no
          clear indicator that systems have tangible risks and do not require an
          emergency response.
        </p>
      </div>
      <div>
        <h4 className="font-semibold leading-8">P0 - Critical Severity</h4>
        <p>
          Critical issues relate to actively exploited risks and involve a
          malicious actor or threats that put any individual at risk of physical
          harm. Identification of active exploitation is required to meet this
          severity category.
        </p>
      </div>
    </div>
  </div>
);

const DocumentationContent = () => (
  <>
    <p className="mb-2 text-gray-600 text-sm">
      All reported security events, incidents, and response activities shall be
      documented and adequately protected in{" "}
      <span className="cursor-pointer font-medium text-primary hover:underline">
        where are security events, incidents and response documented?
      </span>
    </p>
    <p className="text-gray-600 text-sm">
      A root cause analysis may be performed on all verified{" "}
      <span className="cursor-pointer font-medium text-primary hover:underline">
        P0
      </span>{" "}
      security incidents. A root cause analysis report shall be documented and
      referenced in the incident ticket. The root cause analysis shall be
      reviewed by the{" "}
      <span className="cursor-pointer font-medium text-primary hover:underline">
        reviewer of root cause analysis and decider of requirement for
        post-mortem
      </span>{" "}
      who shall determine if a post-mortem meeting will be called.
    </p>
  </>
);

const SinglePolicy: FunctionComponent<SinglePolicyProps> = () => {
  return (
    <div className="flex flex-col gap-4 px-4 [@media(min-width:1400px)]:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Incident Response Plan</h1>
        <div className="flex items-center gap-2">
          <ProgressCircle value={53} max={78} size="lg" />
          <span className="text-gray-600 text-lg">53/78 Completed</span>
        </div>
      </div>
      <div className="container mx-auto flex gap-6">
        {/* Left section */}
        <div className="flex w-2/3 flex-col gap-6">
          <SectionCard title="Severity">
            <SeverityContent />
          </SectionCard>
          <SectionCard title="Documentation">
            <DocumentationContent />
          </SectionCard>
          <SectionCard title="Security">
            <SeverityContent />
          </SectionCard>
        </div>

        {/* Right section */}
        <div className="w-1/3">
          <div>
            {/* Card for Form Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <h2 className="font-semibold text-lg">Documentation</h2>
                <span className="inline-flex items-center gap-2 text-gray-600 text-sm">
                  <ProgressCircle value={53} max={78} size="sm" />
                  1/3 Completed
                </span>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-gray-500 text-sm">
                  Describes the organisation's documentation process for
                  security events and incidents.
                </p>

                {/* Input Field */}
                <div>
                  <label
                    htmlFor="documentation"
                    className="mb-2 block font-medium text-gray-700 text-sm"
                  >
                    Where are security events, incidents and response
                    documented?
                  </label>
                  <Input
                    id="documentation"
                    placeholder="e.g. Company Support team"
                    className="w-full"
                  />
                </div>

                {/* Checkbox Group */}
                <div>
                  <span className="mb-2 block font-medium text-gray-700 text-sm">
                    Which level of priority do you perform analysis on?
                  </span>
                  <div className="gap-2">
                    <div className="flex items-center">
                      <Checkbox id="p0" className="mr-2" defaultChecked />
                      <label htmlFor="p0" className="text-sm">
                        P0 (Recommended)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="p1" className="mr-2" />
                      <label htmlFor="p1" className="text-sm">
                        P1
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="p2p3" className="mr-2" />
                      <label htmlFor="p2p3" className="text-sm">
                        P2/P3
                      </label>
                    </div>
                  </div>
                </div>

                {/* Input Field */}
                <div>
                  <label
                    htmlFor="root-cause"
                    className="mb-2 block font-medium text-gray-700 text-sm"
                  >
                    Who reviews root cause analysis?
                  </label>
                  <Input
                    id="root-cause"
                    placeholder="e.g IT Manager, VP of Engineering"
                    className="w-full"
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button size="sm">Next section</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePolicy;
