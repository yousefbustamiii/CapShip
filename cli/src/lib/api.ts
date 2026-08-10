const API_BASE = process.env["CAPSHIP_API_URL"] ?? "https://api.capship.org";

interface SuccessBody<T> {
  success: true;
  data: T;
}

interface ErrorBody {
  success: false;
  error: { code: string; message: string };
}

type ApiBody<T> = SuccessBody<T> | ErrorBody;

interface DownloadData {
  downloadUrl: string;
  expiresInSeconds: number;
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const body = (await res.json()) as ApiBody<T>;

  if (!body.success) {
    throw new Error(body.error.message);
  }

  return body.data;
}

export async function fetchFreeBundleUrl(): Promise<string> {
  const data = await request<DownloadData>("/v1/downloads/free");
  return data.downloadUrl;
}

export async function redeemLicense(key: string): Promise<string> {
  const data = await request<DownloadData>("/v1/licenses/redeem", {
    method: "POST",
    body: JSON.stringify({ key: key.trim() }),
  });
  return data.downloadUrl;
}
