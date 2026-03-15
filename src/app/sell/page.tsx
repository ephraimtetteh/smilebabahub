"use client";

import React, { useEffect, useState } from "react";
import Form1 from "./_component/Form1";
import Form2 from "./_component/Form2";
import { validateForm } from "@/src/utils/sellFormutils";
import StepProgress from "./_component/StepProgress";
import Form3 from "./_component/Form3";
import { SellFormData } from "@/src/types/types";
import { useAppSelector } from "../redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SuccessPage from "./_component/Form4";

const ProductUpload = () => {
  const { user } = useAppSelector((state) => state.auth)

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const router = useRouter()
  // const handleInputChange = (e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //     setFormData({ ...formData, [e.target.name]: e.target.value });
  //     console.log(formData);
  //   };

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


    const handleSubmit = async () => {
      setIsSubmitting(true);

      try {
        const form = new FormData();

        form.append("title", formData.title);
        form.append("category", formData.category);
        form.append("subcategory", formData.subcategory);
        form.append("type", formData.type);
        form.append("description", formData.description);
        form.append("price", formData.price);
        form.append("price", formData.name);
        form.append("price", formData.phone);
        form.append("price", formData.region);
        form.append("price", formData.city);

        formData.images.forEach((img) => {
          if (img) form.append("images", img);
        });

        if (!user) {
          router.push("/auth/login");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/create`,
          {
            method: "POST",
            body: form,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload product");
        }

        toast.success("Product successfully added");
        localStorage.removeItem("sellFormDraft");
        setCurrentStep(4);
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload product");
      } finally {
        setIsSubmitting(false);
      }
    };


    
    switch (currentStep) {
      case 1:
        return (
          <>
            <StepProgress step={currentStep} />
            <Form1
              data={formData}
              updateField={updateField}
              onNext={nextStep}
              errors={errors}
            />
          </>
        );

      case 2:
        return (
          <>
            <StepProgress step={currentStep} />
            <Form2
              data={formData}
              updateField={updateField}
              onNext={nextStep}
              onBack={prevStep}
              errors={errors}
            />
          </>
        );

      case 3:
        return (
          <>
            <StepProgress step={currentStep} />
            <Form3 data={formData} onBack={prevStep} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </>
        );

      case 4:
        return (
          <>
            <StepProgress step={currentStep} />
            <SuccessPage />
          </>
        );

      default:
        return null;
    }
};

export default ProductUpload;
