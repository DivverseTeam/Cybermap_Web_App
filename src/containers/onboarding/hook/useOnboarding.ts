import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  OrganizationIndustry,
  OrganizationKind,
  OrganizationSize,
} from "~/lib/types";
import { api } from "~/trpc/react";

const schema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Organization name must be at least 3 characters long",
    })
    .max(50, { message: "Organization name cannot exceed 50 characters" }),
  kind: OrganizationKind,
  industry: OrganizationIndustry,
  frameworks: z.array(z.string()).optional(),
  integrations: z.array(z.string()).optional(),
  size: OrganizationSize,
  logo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function useOnboarding() {
  const [step, setStep] = useState(1);
  const {
    mutate: onboardingMutate,
    isPending,
    error,
  } = api.user.completeOnboarding.useMutation();

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
    console.log("Form submitted successfully:", data, step);
    onboardingMutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          // form.reset();
        },
        onError: (error: any) => {
          console.error("Error signing up:", error);
        },
      }
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
