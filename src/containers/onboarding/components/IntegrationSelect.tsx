import Image from "next/image";
import React from "react";
import type { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type IntegrationSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  errors?: FieldError;
};

export default function IntegrationSelect({
  value,
  onChange,
  errors,
}: IntegrationSelectProps) {
  console.log("IntegrationSelect", value);
  const [selectedIds, setSelectedIds] = React.useState<string[]>(value || []);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item: any) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isSelected = (id: string) => selectedIds?.includes(id) || false;

  React.useEffect(() => {
    onChange(selectedIds);
  }, [selectedIds]);

  return (
    <div className="flex flex-wrap items-center gap-8">
      {[
        "/integrations/vercel.svg",
        "/integrations/supabase.svg",
        "/integrations/gcp.svg",
        "/integrations/heroku.svg",
        "/integrations/aws.svg",
        "/integrations/azure.svg",
        "/integrations/digitalOcean.svg",
        "/integrations/netlify.svg",
      ].map((item, index) => (
        <div
          key={item + String(index)}
          onClick={() => handleSelect(`${index}`)}
          className={twMerge(
            "flex h-[150px] w-[150px] cursor-pointer items-center justify-center rounded-[8px] border-2 p-[10px] hover:border-2 hover:border-[#305EFF] hover:border-solid",
            isSelected(index.toString())
              ? "border-[#305EFF] border-solid"
              : "border-[#CBD5E2] border-solid",
          )}
        >
          <div className="relative block h-[90px] w-[150px] bg-white">
            <Image
              src={item}
              alt="image"
              fill={true}
              priority={true}
              style={{
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
