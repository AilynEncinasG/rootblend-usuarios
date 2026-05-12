export function formatApiError(errors: unknown, fallback: string) {
  if (!errors || typeof errors !== "object") {
    return fallback;
  }

  const firstValue = Object.values(errors as Record<string, unknown>)[0];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return String(firstValue[0]);
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return fallback;
}