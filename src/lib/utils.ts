import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Oauth2Provider } from "./types/integrations";
import { integrations } from "./constants/integrations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const unslugify = (slug: string) =>
  slug
    .replace(/\-/g, " ")
    .replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    );

export const slugify = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();
  str = str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return str;
};

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
};

export const titleCaseStatus = (input: string): string => {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getProviderByIntegrationId = (
  integrationId: string,
): Oauth2Provider | null => {
  return (
    integrations.find((i) => i.id === integrationId)?.oauthProvider ?? null
  );
};

// export const humanFileSize = (bytes, si=false, dp=1) => {
//   const thresh = si ? 1000 : 1024;

//   if (Math.abs(bytes) < thresh) {
//     return bytes + ' B';
//   }

//   const units = si
//     ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
//     : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
//   let u = -1;
//   const r = 10**dp;

//   do {
//     bytes /= thresh;
//     ++u;
//   } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

//   return bytes.toFixed(dp) + ' ' + units[u];
// }

export const humanFileSize = (size: number) => {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    +(size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  );
};
