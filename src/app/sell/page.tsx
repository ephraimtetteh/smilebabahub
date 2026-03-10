"use client";

import React, { useEffect, useState } from "react";
import Form1 from "./_component/Form1";
import Form2 from "./_component/Form2";
import { validateForm } from "@/src/utils/sellFormutils";
import StepProgress from "./_component/StepProgress";
import Form3 from "./_component/Form3";
import { SellFormData } from "@/src/types/types";

const ProductUpload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    categoryChild: "",
    images: [null, null, null, null, null],
    region: "",
    city: "",
    description: "",
    phone: "",
    price: "",
    name: "",
  });

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
            <Form3 data={formData} onBack={prevStep} />
          </>
        );

      default:
        return null;
    }
};

export default ProductUpload;
