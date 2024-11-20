import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Oauth2Provider } from "./types/integrations";
import { Oauth2ProviderIntegrationIdsMap } from "./constants/integrations";

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

export const getProviderByIntegrationId = (
  integrationId: string,
): Oauth2Provider | null => {
  const entry = Object.entries(Oauth2ProviderIntegrationIdsMap).find(
    ([_, ids]) => ids.includes(integrationId),
  );

  return entry ? (entry[0] as Oauth2Provider) : null;
};
