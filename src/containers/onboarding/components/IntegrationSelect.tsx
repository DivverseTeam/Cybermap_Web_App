import Image from "next/image";
import React from "react";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type IntegrationSelectProps = {
  value: string;
  onChange: (value: string[]) => void;
  errors?: FieldError;
};

export default function IntegrationSelect({
  value,
  onChange,
  errors,
}: IntegrationSelectProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isSelected = (id: string) => selectedIds.includes(id);

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
            "flex items-center justify-center h-[150px] w-[150px] rounded-[8px] cursor-pointer p-[10px] border-2 hover:border-2 hover:border-solid hover:border-[#305EFF]",
            isSelected(item)
              ? "border-solid border-[#305EFF]"
              : "border-solid border-[#CBD5E2]"
          )}
        >
          <div className="relative block h-[90px] w-[150px] bg-white">
            <Image
              src={item}
              alt="image"
              fill={true}
              objectFit="contain"
              objectPosition="center"
              priority={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
