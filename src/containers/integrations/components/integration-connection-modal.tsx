import { zodResolver } from "@hookform/resolvers/zod";
import type { FunctionComponent } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import type { Integration, Oauth2Provider } from "~/lib/types/integrations";
import { type Schema, z } from "zod";

interface IntegrationConnectionModalProps {
  integration: Integration;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OauthProviderConnectionPropsMap: Record<
  Oauth2Provider,
  {
    input: Array<{
      name: string;
      label: string;
      placeholder: string;
    }>;
    schema: Schema;
  }
> = {
  MICROSOFT: {
    input: [
      {
        name: "tenantId",
        label: "Tenant ID",
        placeholder:
          "The unique identifier of your Azure Active Directory tenant",
      },
      {
        name: "workspaceId",
        label: "Workspace ID",
        placeholder:
          "The unique identifier of your Azure Log Analytics workspace",
      },
    ],
    schema: z.object({
      tenantId: z
        .string()
        .uuid({ message: "Please enter a valid tenant id" })
        .trim(),
      workspaceId: z.string().optional(),
    }),
  },
  GOOGLE: {
    input: [
      {
        name: "projectId",
        label: "Project ID",
        placeholder: "The unique identifier of your project on GCP",
      },
    ],
    schema: z.object({
      projectId: z.string(),
    }),
  },
};

const IntegrationConnectionModal: FunctionComponent<
  IntegrationConnectionModalProps
> = ({ integration, onSubmit, open, onOpenChange }) => {
  const { name, image, description, oauthProvider } = integration;
  if (!oauthProvider) {
    return;
  }

  const { input, schema } =
    OauthProviderConnectionPropsMap[oauthProvider as Oauth2Provider];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onFormSubmit: SubmitHandler<typeof schema> = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-y-10 p-8 sm:max-w-[800px]">
        <DialogHeader className="flex flex-col gap-y-3">
          <div className="flex items-center gap-x-4">
            <Image
              src={image}
              alt={`${name} Logo`}
              width={48}
              height={48}
              className="flex h-12 items-center justify-center rounded-md border-2 p-2"
            />
            <DialogTitle>{`Add ${name} Connection`}</DialogTitle>
          </div>
          <DialogDescription>
            {description ? (
              description
            ) : (
              <>
                Cybermap uses <span className="text-blue-500">OAuth 2.0</span>{" "}
                to monitor and manage {name} resources
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          // @ts-ignore
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-y-6"
        >
          <div className="flex flex-col gap-y-6">
            {input.map((field) => (
              <div key={field.name} className="flex flex-col gap-y-1">
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
                />
                {errors[field.name] && (
                  <p className="text-red-600 text-sm">
                    {/* @ts-ignore */}
                    {errors[field.name]?.message || "This field is invalid."}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div>
            <Button type="submit" variant="outline" size="default">
              Connect with OAuth 2.0
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationConnectionModal;
