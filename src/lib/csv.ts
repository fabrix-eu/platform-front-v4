/**
 * Comma separated search params — the shape every multi-value filter uses, so a
 * filtered list stays one shareable URL instead of a repeated query key.
 */
export const csvList = (value?: string): string[] => (value ? value.split(",").filter(Boolean) : []);

/** Toggling one value on or off, back into the comma separated param. */
export function toggleCsv(value: string | undefined, entry: string): string | undefined {
  const current = csvList(value);
  const next = current.includes(entry) ? current.filter((v) => v !== entry) : [...current, entry];
  return next.length > 0 ? next.join(",") : undefined;
}
