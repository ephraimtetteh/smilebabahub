// src/utils/uploadToCloudinary.ts
// Uploads a single File to Cloudinary using an unsigned upload preset.
// Returns { url, publicId } on success.
//
// Setup:
//   1. In Cloudinary dashboard → Settings → Upload → Upload presets
//      Create an "unsigned" preset named e.g. "smilebaba_ads"
//   2. Add to frontend .env.local:
//      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your_cloud_name
//      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = smilebaba_ads

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

  if (!cloud || !preset) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", "smilebaba/ads");

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
          width: data.width,
          height: data.height,
        });
      } else {
        reject(
          new Error(
            `Cloudinary upload failed: ${xhr.status} ${xhr.statusText}`,
          ),
        );
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload")),
    );
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud}/image/upload`);
    xhr.send(formData);
  });
}

// Upload multiple files in parallel, returning results in order
export async function uploadManyToCloudinary(
  files: File[],
  onProgress?: (overallPct: number) => void,
): Promise<CloudinaryResult[]> {
  if (!files.length) return [];

  const progresses = new Array(files.length).fill(0);

  const updateOverall = () => {
    if (!onProgress) return;
    const overall = Math.round(
      progresses.reduce((sum, p) => sum + p, 0) / files.length,
    );
    onProgress(overall);
  };

  return Promise.all(
    files.map((file, i) =>
      uploadToCloudinary(file, (pct) => {
        progresses[i] = pct;
        updateOverall();
      }),
    ),
  );
}
