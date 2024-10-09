import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  orgName: z
    .string()
    .min(3, {
      message: "Organization name must be at least 3 characters long",
    })
    .max(50, { message: "Organization name cannot exceed 50 characters" }),
  kind: z.string(),
  industry: z.string(),
  frameworkIds: z.array(z.string()),
  integrationIds: z.array(z.string()),
  size: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function useOnboarding() {
  const [step, setStep] = useState(1);
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
  };

  async function changeStep(num: number) {
    if (num < step) {
      setStep(num);
      return;
    } else {
      if (step === 1) {
        const valid = await trigger(["orgName", "kind", "industry", "size"]);
        console.log("step one:", errors, getValues(), valid, num);
        if (valid) setStep(num);
      }
      if (step === 2) {
        const valid = await trigger(["frameworkIds"]);
        console.log("step two:", errors, getValues(), valid, num);
        if (valid) setStep(num);
      }
    }
    console.log("step two:", errors, getValues(), num);
  }

  return {
    step,
    control,
    errors,
    setValue,
    handleSubmit,
    onSubmit,
    changeStep,
  };
}
