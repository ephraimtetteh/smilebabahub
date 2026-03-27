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

export async function uploadToCloudinary(
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

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
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
      reject(new Error("Upload was cancelled")),
    );

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud}/image/upload`);
    xhr.send(formData);
  });
}

// ── Upload multiple in parallel ────────────────────────────────────────────
export async function uploadManyToCloudinary(
  files: File[],
  onProgress?: (overallPct: number) => void,
): Promise<CloudinaryResult[]> {
  if (!files.length) return [];

  const progresses = new Array(files.length).fill(0);

  const reportOverall = () => {
    if (!onProgress) return;
    const overall = Math.round(
      progresses.reduce((a, b) => a + b, 0) / files.length,
    );
    onProgress(overall);
  };

  return Promise.all(
    files.map((file, i) =>
      uploadToCloudinary(file, (pct) => {
        progresses[i] = pct;
        reportOverall();
      }),
    ),
  );
}
