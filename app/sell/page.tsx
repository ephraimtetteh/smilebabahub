"use client";

import React, { useState } from "react";
import Form1 from "./_component/Form1";
import Form2 from "./_component/Form2";
import Form3 from "./_component/Form3";

const page = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <Form1 onNext={() => setStep(2)} />}
      {step === 2 && (
        <Form2 onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <Form3 onNext={() => setStep(4)} onBack={() => setStep(2)} />
      )}
    </>
  );
};

export default page;
