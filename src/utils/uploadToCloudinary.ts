// src/lib/uploadToCloudinary.ts
// Uploads images directly from the browser to Cloudinary (unsigned preset).
// No file ever passes through your Express server.
//
// Required in .env.local:
//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   = dsp3guzpl
//   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = smilebaba_ads  (must be UNSIGNED in dashboard)

export type CloudinaryResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

// ── Why uploads used to stall on a percentage ──────────────────────────────
// Phone photos are 4–12 MB each, every one was sent at once at full size,
// and a request that stopped mid-way (weak 4G, a tab in the background)
// had no time limit — so the bar froze forever. Now each photo is shrunk
// in the browser first (≤ 2000 px, ~0.5–1.5 MB), at most 3 go at a time,
// a stuck upload is cut off after 90 s of no progress and retried twice,
// and the bar never sits still without a reason.

const MAX_SIDE = 2000;
const STALL_MS = 90_000;
const RETRIES = 2;
const CONCURRENCY = 3;

/** Shrink a photo in the browser. Returns the original if it can't (HEIC on
 *  non-Safari, GIF, SVG, tiny files) — Cloudinary converts those itself. */
export async function compressImage(file: File): Promise<File> {
  try {
    if (typeof window === "undefined" || !file.type.startsWith("image/")) return file;
    if (/gif|svg/i.test(file.type) || file.size < 400_000) return file;
    const bitmap = await createImageBitmap(file).catch(() => null);
    if (!bitmap) return file; // e.g. HEIC in Chrome — let Cloudinary handle it
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export async function uploadToCloudinary(
  original: File,
  onProgress?: (pct: number) => void,
): Promise<CloudinaryResult> {
  const file = await compressImage(original);
  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      return await uploadOnce(file, onProgress);
    } catch (e: any) {
      lastErr = e;
      // Config problems won't fix themselves — don't retry those
      if (/preset|not set|cancelled/i.test(String(e?.message))) throw e;
      onProgress?.(0);
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Upload failed. Check your connection and try again.");
}

function uploadOnce(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<CloudinaryResult> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // ── Env check ──────────────────────────────────────────────────────────
  if (!cloud) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in .env.local",
    );
  }
  if (!preset) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set in .env.local",
    );
  }

  // ── Build FormData ─────────────────────────────────────────────────────
  // NOTE: Only append what Cloudinary unsigned presets allow.
  // "folder" is fine for unsigned presets — it scopes where files are stored.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  // folder is optional — remove this line if you get "folder not allowed" errors
  formData.append("folder", "smilebaba/ads");

  // ── Upload via XHR for real progress events ────────────────────────────
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Cut off an upload that stops moving, so it can be retried
    let stall: ReturnType<typeof setTimeout> | undefined;
    const kick = () => {
      if (stall) clearTimeout(stall);
      stall = setTimeout(() => {
        xhr.abort();
        reject(new Error("The upload stopped responding. Retrying…"));
      }, STALL_MS);
    };
    const done = () => stall && clearTimeout(stall);
    kick();

    xhr.upload.addEventListener("progress", (e) => {
      kick();
      if (e.lengthComputable && onProgress) {
        // 95% max until Cloudinary answers — the last bit is processing
        onProgress(Math.min(95, Math.round((e.loaded / e.total) * 95)));
      }
    });
    xhr.addEventListener("loadend", done);

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let data: any;
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          return reject(new Error("Cloudinary sent an unexpected reply. Retrying…"));
        }
        onProgress?.(100);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width ?? 0,
          height: data.height ?? 0,
        });
      } else {
        // Parse the Cloudinary error body for the real reason
        let reason = `${xhr.status} ${xhr.statusText}`;
        try {
          const body = JSON.parse(xhr.responseText);
          reason = body?.error?.message ?? reason;
        } catch {}

        console.error(
          "Cloudinary upload failed:",
          reason,
          "\nResponse:",
          xhr.responseText,
        );

        reject(
          new Error(
            reason.includes("preset")
              ? `Upload preset "${preset}" not found or not set to unsigned. ` +
                  `Go to Cloudinary → Settings → Upload → Upload presets and create an unsigned preset named "${preset}".`
              : `Cloudinary upload failed: ${reason}`,
          ),
        );
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error — check your internet connection")),
    );
    xhr.addEventListener("abort", () =>
      reject(new Error("The upload stopped responding. Retrying…")),
    );

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud}/image/upload`);
    xhr.send(formData);
  });
}

// ── Upload several, 3 at a time, in order ──────────────────────────────────
export async function uploadManyToCloudinary(
  files: File[],
  onProgress?: (overallPct: number) => void,
): Promise<CloudinaryResult[]> {
  if (!files.length) return [];

  const progresses = new Array(files.length).fill(0);
  const results = new Array<CloudinaryResult>(files.length);
  let last = -1;
  const reportOverall = () => {
    if (!onProgress) return;
    const overall = Math.round(progresses.reduce((a, b) => a + b, 0) / files.length);
    if (overall !== last) onProgress((last = overall));
  };

  let next = 0;
  const worker = async () => {
    while (next < files.length) {
      const i = next++;
      results[i] = await uploadToCloudinary(files[i], (pct) => {
        progresses[i] = pct;
        reportOverall();
      });
      progresses[i] = 100;
      reportOverall();
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));
  return results;
}
