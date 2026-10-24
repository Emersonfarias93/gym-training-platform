import "server-only";

/** Never expose this key through NEXT_PUBLIC variables or browser requests. */
export function internalApiHeaders(): Record<string, string> {
  const key = process.env.INTERNAL_API_KEY;
  return key ? { "X-Internal-Api-Key": key } : {};
}
