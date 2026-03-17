"use client";

import React, { useEffect, useState } from "react";
import Form1 from "./_component/Form1";
import Form2 from "./_component/Form2";
import { validateForm } from "@/src/utils/sellFormutils";
import StepProgress from "./_component/StepProgress";
import Form3 from "./_component/Form3";
import { SellFormData } from "@/src/types/types";
import { toast } from "react-toastify";
import SuccessPage from "./_component/Form4";
import axiosInstance from "@/src/lib/api/axios";
import ProtectedRoute from "@/src/components/ProtectRoute";

const ProductUpload = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

    
  const nextStep = () => {
    const { isValid, errors } = validateForm(formData, currentStep);

    if (!isValid) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => prev + 1);
  };

    const prevStep = () => {
      setCurrentStep(currentStep - 1);
    };

  
    useEffect(() => {
      localStorage.setItem("sellFormDraft", JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
      const savedDraft = localStorage.getItem("sellFormDraft");

      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      }
    }, []);


    // const handleSubmit = async () => {
    //   setIsSubmitting(true);
    
    //   try {
    //     if (!user) {
    //       router.push("/auth/login");
    //       return;
    //     }
    
    //     const form = new FormData();
    
    //     form.append("title", formData.title);
    //     form.append("category", formData.category);
    //     form.append("subcategory", formData.subcategory);
    //     form.append("type", formData.type);
    //     form.append("description", formData.description);
    //     form.append("price", formData.price);
    //     form.append("name", formData.name);
    //     form.append("phone", formData.phone);
    //     form.append("region", formData.region);
    //     form.append("city", formData.city);
    
    //     formData.images.forEach((img) => {
    //       if (img) form.append("images", img);
    //     });
    
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/create`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //         body: form,
    //         credentials: "include",
    //       },
    //     );
    
    //     if (!response.ok) {
    //       throw new Error("Failed to upload product");
    //     }
    
    //     toast.success("Product successfully added");
    
    //     localStorage.removeItem("sellFormDraft");
    
    //     setCurrentStep(4);
    
    //   } catch (error) {
    //     console.error(error);
    //     toast.error("Failed to upload product");
    //   } finally {
    //     setIsSubmitting(false);
    //   }
    // };


    const handleSubmit = async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        const form = new FormData();

        form.append("title", formData.title);
        form.append("category", formData.category);
        form.append("subcategory", formData.subcategory);
        form.append("type", formData.type);
        form.append("description", formData.description);
        form.append("price", formData.price);
        form.append("name", formData.name);
        form.append("phone", formData.phone);
        form.append("region", formData.region);
        form.append("city", formData.city);

        formData.images
  .filter((file): file is File => file !== null)
  .forEach((file) => {
    form.append("images", file);
  });

        await axiosInstance.post("/products/create", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
          toast.error("Session expired. Please try again.");
        } else {
          toast.error("Failed to upload product");
        }
      
      } finally {
        setIsSubmitting(false);
        setUploadProgress(0);
      }
    };


    
    // switch (currentStep) {
    //   case 1:
    //     return (
    //       <>
    //         <StepProgress step={currentStep} />
    //         <Form1
    //           data={formData}
    //           updateField={updateField}
    //           onNext={nextStep}
    //           errors={errors}
    //         />
    //       </>
    //     );

    //   case 2:
    //     return (
    //       <>
    //         <StepProgress step={currentStep} />
    //         <Form2
    //           data={formData}
    //           updateField={updateField}
    //           onNext={nextStep}
    //           onBack={prevStep}
    //           errors={errors}
    //         />
    //       </>
    //     );

    //   case 3:
    //     return (
    //       <>
    //         <StepProgress step={currentStep} />
    //         <ProtectedRoute>
    //           <Form3
    //             data={formData}
    //             onBack={prevStep}
    //             handleSubmit={handleSubmit}
    //             isSubmitting={isSubmitting}
    //             uploadProgress={uploadProgress}
    //           />
    //         </ProtectedRoute>
    //       </>
    //     );

    //   case 4:
    //     return (
    //       <>
    //         <StepProgress step={currentStep}  />
    //         <SuccessPage />
    //       </>
    //     );

    //   default:
    //     return null;
    // }

    return (
      <ProtectedRoute>
        <>
          <StepProgress step={currentStep} />

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
      </ProtectedRoute>
    );
};

export default ProductUpload;
