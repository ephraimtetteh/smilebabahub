"use client";

interface Props {
  step: number;
}

const steps = ["Details", "Location", "Review", "Ad Published"];

export default function StepProgress({ step }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 pt-30 ">
      <div className="flex items-center justify-between ">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const active = step >= stepNumber;

          return (
            <div key={label} className="flex flex-1 items-center">
              {/* Circle */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                ${
                  active ? "bg-black text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>

              {/* Label */}
              <p
                className={`ml-2 text-sm hidden sm:block ${
                  active ? "text-black font-medium" : "text-gray-400"
                }`}
              >
                {label}
              </p>

              {/* Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-3 ${
                    step > stepNumber ? "bg-black" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
