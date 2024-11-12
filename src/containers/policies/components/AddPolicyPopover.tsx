import { PopoverClose } from "@radix-ui/react-popover";
import { Cancel01Icon } from "hugeicons-react";
import type { FunctionComponent } from "react";
import { Button } from "~/app/_components/ui/button";
import { PopoverContent } from "~/app/_components/ui/popover";

interface Props {}

const AddPolicyPopover: FunctionComponent<Props> = () => {
  return (
    <PopoverContent className="w-[448px] rounded-lg p-6">
      <PopoverClose asChild className="absolute top-4 right-4">
        <Button size="icon" variant="ghost">
          <Cancel01Icon />
        </Button>
      </PopoverClose>
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="font-semibold text-lg">Add custom policy</h4>
          <p className="text-sm">
            Upload custom policy using{" "}
            <span className="text-primary">this template</span>
          </p>
        </div>

        <div className="rounded-md border-2 border-gray-300 border-dashed bg-[#F7FAFC] p-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 32L24 24L16 32"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 24V42"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M40.78 36.78C42.7307 35.7166 44.2717 34.0338 45.1598 31.9973C46.0478 29.9608 46.2324 27.6865 45.6844 25.5334C45.1364 23.3803 43.887 21.4711 42.1334 20.1069C40.3797 18.7428 38.2217 18.0015 36 18H33.48C32.8746 15.6585 31.7463 13.4847 30.1799 11.642C28.6135 9.79933 26.6497 8.33573 24.4362 7.36124C22.2227 6.38676 19.8171 5.92675 17.4002 6.01579C14.9834 6.10484 12.6181 6.74063 10.4824 7.87536C8.34658 9.01009 6.49583 10.6142 5.06926 12.5672C3.64268 14.5202 2.67739 16.7711 2.24597 19.1508C1.81455 21.5305 1.92822 23.9771 2.57844 26.3066C3.22865 28.636 4.3985 30.7878 6.00001 32.6"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 32L24 24L16 32"
                stroke="#A0AEC0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">
                Select a file or drag and drop here
              </p>
              <p className="text-gray-400 text-xs">
                CSV or XLSX file no more than 10MB
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="mt-4 text-xs">
            SELECT FILE
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Upload template</Button>
        </div>
      </div>
    </PopoverContent>
  );
};

export default AddPolicyPopover;
