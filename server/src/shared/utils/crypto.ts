export function generateId(): string {
  return crypto.randomUUID();
}

export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode("capship-timing-safe"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(a)),
    crypto.subtle.sign("HMAC", keyMaterial, encoder.encode(b)),
  ]);

  if (sigA.byteLength !== sigB.byteLength) return false;

  const viewA = new Uint8Array(sigA);
  const viewB = new Uint8Array(sigB);
  let diff = 0;
  for (let i = 0; i < viewA.length; i++) {
    diff |= viewA[i]! ^ viewB[i]!;
  }
  return diff === 0;
}
