"use client";

import Image from "next/image";
import { SellFormData } from "@/src/types/types";
import { Categories } from "@/src/constants/sellFormData";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../redux";


export interface Form3Props {
  data: SellFormData;
  onBack: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  uploadProgress: number
}

const Form3 = ({ data, onBack, handleSubmit, isSubmitting, uploadProgress }: Form3Props) => {
  const router = useRouter();
  const { isAuthenticated, isAuthenticating } = useAppSelector(
    (state) => state.auth,
  );

  const categoryName = Categories.find((c) => c.id === data.category)?.name;

  const subcategoryName = Categories.find(
    (c) => c.id === data.category,
  )?.subcategories?.find((s) => s.id === data.subcategory)?.name;

  const typeName = Categories.find((c) => c.id === data.category)
    ?.subcategories?.find((s) => s.id === data.subcategory)
    ?.children?.find((t) => t.id === data.type)?.name;

    const previewImages = data.images?.map((img) =>
      img ? URL.createObjectURL(img) : null,
    );


    const handleClick = () => {
      if (isAuthenticating) return;

      if (!isAuthenticated) {
        localStorage.setItem("redirectAfterLogin", "/sell");
        router.push("/auth/login");
        return;
      }

      handleSubmit();
    };
  return (
    <div className="min-h-screen flex justify-center px-4 pb-12">
      <div className="w-full max-w-3xl bg-white rounded shadow p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold">Review Your Ad</h2>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <p>Uploading images... {uploadProgress}%</p>
        )}

        {uploadProgress === 100 && <p>Processing upload...</p>}
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-black h-2 rounded"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Images */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.images?.map(
            (img, index) =>
              img && (
                <div key={index} className="relative h-28 w-full">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ),
          )}
        </div>

        {/* Title */}
        <div>
          <p className="text-gray-500 text-sm">Title</p>
          <p className="font-medium">{data.title}</p>
        </div>

        {/* Category */}
        <div>
          <p className="text-gray-500 text-sm">Category</p>
          <p className="font-medium">
            {categoryName} / {subcategoryName} / {typeName}
          </p>
        </div>

        {/* Location */}
        <div>
          <p className="text-gray-500 text-sm">Location</p>
          <p className="font-medium">
            {data.region} - {data.city}
          </p>
        </div>

        {/* Price */}
        <div>
          <p className="text-gray-500 text-sm">Price</p>
          <p className="font-medium">GH₵ {data.price}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-gray-500 text-sm">Description</p>
          <p className="text-gray-700">{data.description}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-gray-500 text-sm">Contact</p>
          <p>{data.name}</p>
          <p>{data.phone}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-6">
          <button onClick={onBack} className="px-6 py-3 border rounded">
            Edit
          </button>
          <button
            type="button"
            className="px-6 py-3 bg-black text-white rounded disabled:opacity-50"
            disabled={isSubmitting || isAuthenticating}
            onClick={handleClick}
          >
            {isSubmitting
              ? "Uploading..."
              : isAuthenticating
                ? "Checking..."
                : "Publish Ad"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form3;
