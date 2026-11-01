export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("213")) return digits;
  if (digits.startsWith("0")) return `213${digits.slice(1)}`;
  return digits;
}

export function phonesMatch(first: string, second: string): boolean {
  const normalizedFirst = normalizePhone(first);
  return normalizedFirst.length > 0 && normalizedFirst === normalizePhone(second);
}

export async function stableClientCode(phone: string): Promise<string> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    throw new Error("A phone number is required to create a stable client code.");
  }

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalizedPhone)
  );
  const suffix = Array.from(new Uint8Array(digest).slice(0, 8))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `IBRA-C-${suffix}`;
}
