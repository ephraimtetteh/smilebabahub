"use client";

import React, { useEffect, useState, useCallback } from "react";
import Form1 from "./_component/Form1";
import Form2 from "./_component/Form2";
import { validateForm } from "@/src/utils/sellFormutils";
import StepProgress from "./_component/StepProgress";
import Form3 from "./_component/Form3";
import { SellFormData } from "@/src/types/types";
import { toast } from "react-toastify";
import SuccessPage from "./_component/Form4";
import axiosInstance from "@/src/lib/api/axios";
import { useAppSelector } from "../redux";
import { useRouter } from "next/navigation";
import { saveReturnState } from "@/src/hooks/useSubscriptionGuard"; // ← new

const ProductUpload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRestoredUpload, setHasRestoredUpload] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { isAuthenticated, hasCheckedAuth, user } = useAppSelector(
    (state) => state.auth,
  );

  // Derived vendor check — same logic as useSubscriptionGuard
  const isVendor = isAuthenticated && user?.role === "vendor";

  const router = useRouter();

  const [formData, setFormData] = useState<SellFormData>({
    title: "",
    category: "",
    subcategory: "",
    type: "",
    images: [null, null, null, null, null],
    region: "",
    city: "",
    description: "",
    phone: "",
    price: "",
    name: "",
  });

  const updateField = <K extends keyof SellFormData>(
    field: K,
    value: SellFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save draft on every formData change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const { images, ...serializableData } = formData;
      localStorage.setItem("sellFormDraft", JSON.stringify(serializableData));
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData]);

  // Restore draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("sellFormDraft");
    if (savedDraft) {
      setFormData((prev) => ({
        ...prev,
        ...JSON.parse(savedDraft),
        images: prev.images,
      }));
    }
  }, []);

  // Restore pending upload after login redirect and auto-submit
  useEffect(() => {
    const pending = localStorage.getItem("pendingUpload");
    if (pending) {
      setFormData((prev) => ({
        ...prev,
        ...JSON.parse(pending),
        images: prev.images,
      }));
      setHasRestoredUpload(true);
      localStorage.removeItem("pendingUpload");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("category", formData.category);
      form.append("subcategory", formData.subcategory);
      form.append("type", formData.type);
      form.append("description", formData.description);
      form.append("price", String(Number(formData.price)));
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("region", formData.region);
      form.append("city", formData.city);

      formData.images
        .filter((file): file is File => file !== null)
        .forEach((file) => form.append("images", file));

      await axiosInstance.post("/products/create", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 0;
          if (total === 0) return;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      toast.success("Product successfully added");
      localStorage.removeItem("sellFormDraft");
      setCurrentStep(4);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (error.response?.data?.code === "SUBSCRIPTION_REQUIRED") {
        // Backend double-check caught it — redirect to subscribe
        toast.info("A vendor subscription is required to post products.");
        saveReturnState({ type: "post_product" });
        router.push("/subscription");
      } else {
        toast.error("Failed to upload product");
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  }, [formData, isSubmitting, router]);

  // Auto-submit after login redirect
  useEffect(() => {
    if (isAuthenticated && hasRestoredUpload && !hasAutoSubmitted) {
      setHasAutoSubmitted(true);
      toast.info("Resuming your upload...");
      handleSubmit();
    }
  }, [isAuthenticated, hasRestoredUpload, hasAutoSubmitted, handleSubmit]);

  const nextStep = () => {
    const { isValid, errors } = validateForm(formData, currentStep);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    // Gate at step 2 transition (before step 3 / review + submit)
    if (currentStep === 2) {
      if (!hasCheckedAuth) return; // wait for auth check

      // 1️⃣ Not logged in → save draft and go to login
      if (!isAuthenticated) {
        const { images, ...serializableData } = formData;
        localStorage.setItem("pendingUpload", JSON.stringify(serializableData));
        localStorage.setItem("redirectAfterLogin", "/sell");
        router.push("/auth/login?reason=sell");
        return;
      }

      // 2️⃣ Logged in but no vendor subscription → save state and go to subscribe
      if (!isVendor) {
        const { images, ...serializableData } = formData;
        // Keep draft so the form is still populated if they come back
        localStorage.setItem("sellFormDraft", JSON.stringify(serializableData));
        saveReturnState({ type: "post_product" });
        toast.info("You need a vendor subscription to post products.");
        router.push("/subscription");
        return;
      }
    }

    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  if (currentStep === 2 && !hasCheckedAuth) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center w-full">
        <StepProgress step={currentStep} />
      </div>

      {currentStep === 1 && (
        <Form1
          data={formData}
          updateField={updateField}
          onNext={nextStep}
          errors={errors}
        />
      )}

      {currentStep === 2 && (
        <Form2
          data={formData}
          updateField={updateField}
          onNext={nextStep}
          onBack={prevStep}
          errors={errors}
        />
      )}

      {currentStep === 3 && (
        <Form3
          data={formData}
          onBack={prevStep}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
        />
      )}

      {currentStep === 4 && <SuccessPage />}
    </>
  );
};

export default ProductUpload;
