import { zodResolver } from "@hookform/resolvers/zod";
import type { FunctionComponent } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { ZodSchema } from "zod";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";

interface InputField {
  name: string;
  label: string;
  placeholder: string;
}

interface IntegrationModalProps<TSchema> {
  logo: string;
  name: string;
  description: string;
  input: Array<InputField>;
  schema: ZodSchema<TSchema>;
  onSubmit: (data: TSchema) => void;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const IntegrationModal = <TSchema extends Record<string, any>>({
  logo,
  name,
  description,
  input,
  schema,
  onSubmit,
}: IntegrationModalProps<TSchema>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSchema>({
    resolver: zodResolver(schema),
  });

  const onFormSubmit: SubmitHandler<TSchema> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <img src={logo} alt={`${name} Logo`} className="h-10 w-10" />
            <DialogTitle>{`Add ${name} Connection`}</DialogTitle>
          </div>
          <DialogDescription className="mt-2">{description}</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6 space-y-4">
          {input.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block font-medium text-gray-700 text-sm"
              >
                {field.label}
              </label>
              <Input
                id={field.name}
                placeholder={field.placeholder}
                {...register(field.name)}
                className="mt-1"
              />
              {errors[field.name] && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors[field.name]?.message || "This field is invalid."}
                </p>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Connect with OAuth 2.0
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationModal;
