"use client";

import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useCallback } from "react";

interface Props {
  images: (File | null)[];
  updateField: (field: string, value: any) => void;
}

export default function ImageUploader({ images, updateField }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = [...images];

      acceptedFiles.forEach((file, index) => {
        if (index < newImages.length) {
          newImages[index] = file;
        }
      });

      updateField("images", newImages);
    },
    [images],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 4,
    onDrop,
  });

  return (
    <div>
      <p className="text-lg font-semibold">Add Photos</p>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />

        <p>Drag images here or click to upload</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {images.map((img, index) => (
          <div key={index} className="relative w-full h-24">
            {img && (
              <Image
                src={URL.createObjectURL(img)}
                alt="preview"
                fill
                className="object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
