import React, { useState } from 'react';

const steps = [
  'Upload Background',
  'Design Certificate',
  'Enter Recipients',
  'Preview & Download'
];

export default function Wizard({ children }: { children?: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, idx) => (
          <div key={step} className="flex-1 text-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1 ${idx === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{idx + 1}</div>
            <span className={`text-xs ${idx === currentStep ? 'font-bold text-blue-600' : 'text-gray-500'}`}>{step}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentStep(s => Math.max(s - 1, 0))}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </button>
      </div>
      <div className="bg-white rounded shadow p-4 min-h-[200px]">
        {children ? children : <p>Step {currentStep + 1}: {steps[currentStep]}</p>}
      </div>
      <div className="mt-4 text-center text-gray-400 text-xs">Progress: {currentStep + 1} / {steps.length}</div>
    </div>
  );
}
