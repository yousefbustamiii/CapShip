import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { unzip } from "fflate";

export async function downloadAndExtract(
  url: string,
  dest: string,
): Promise<void> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }

  const buffer = await res.arrayBuffer();
  const uint8 = new Uint8Array(buffer);

  const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
    unzip(uint8, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  for (const [relativePath, data] of Object.entries(files)) {
    if (relativePath.endsWith("/")) continue;

    const fullPath = join(dest, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, data);
  }
}
