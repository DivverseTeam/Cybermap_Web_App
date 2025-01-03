import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  FrameworkName,
  OrganisationIndustry,
  OrganisationKind,
  OrganisationSize,
} from "~/lib/types";
import { api } from "~/trpc/react";

const schema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Organisation name must be at least 3 characters long",
    })
    .max(50, { message: "Organisation name cannot exceed 50 characters" }),
  kind: OrganisationKind,
  industry: OrganisationIndustry,
  frameworks: z.array(FrameworkName).optional(),
  integrations: z.array(z.string()).optional(),
  size: OrganisationSize,
  logoUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function useOnboarding() {
  const [step, setStep] = useState(1);
  const { mutate: onboardingMutate, isPending } =
    api.user.completeOnboarding.useMutation();
  const { update: updateSession } = useSession();

  const router = useRouter();

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    const { name, kind, frameworks, size, industry } = data;
    console.log("Form submitted successfully:", data, step);
    onboardingMutate(
      {
        name,
        kind,
        size,
        industry,
        frameworks,
      },
      {
        onSuccess: (data) => {
          if (data?.organisationId) {
            updateSession({
              organisationId: data.organisationId,
            });
          }

          toast.success("Onboarding completed successfully", {
            description: "You can now start using the app",
          });

          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        },
        onError: (error: any) => {
          console.error("Error signing up:", error);
        },
      },
    );
  };

  async function changeStep(num: number) {
    if (num < step) {
      setStep(num);
      return;
    } else {
      if (step === 1) {
        const valid = await trigger(["name", "kind", "industry", "size"]);
        console.log("step one:", errors, getValues(), valid, num);
        if (valid) setStep(num);
      }
      if (step === 2) {
        const valid = await trigger(["integrations"]);
        console.log("step two:", errors, getValues(), valid, num);
        if (valid) setStep(num);
      }
      if (step === 3) {
        const valid = await trigger(["frameworks"]);
        console.log("step three:", errors, getValues(), valid, num);
        if (valid) {
          onSubmit(getValues());
          // setStep(num);
        }
      }
    }
  }

  return {
    isPending,
    step,
    control,
    errors,
    setValue,
    handleSubmit,
    onSubmit,
    changeStep,
  };
}
