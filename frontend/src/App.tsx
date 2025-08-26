import React, { useState } from 'react';
import UploadBackground from './components/UploadBackground/UploadBackground';
import Designer from './components/Designer/Designer';
import RecipientEntry from './components/RecipientEntry/RecipientEntry';
import DownloadLink from './components/Download/DownloadLink';
import Wizard from './components/Wizard/Wizard';
import AccessibilityHelper from './components/AccessibilityHelper';

function App() {
  const steps = [
    { label: 'Upload Background', component: <UploadBackground /> },
    { label: 'Design Certificate', component: <Designer /> },
    { label: 'Enter Recipients', component: <RecipientEntry /> },
    { label: 'Preview & Download', component: <DownloadLink url="/api/certificates/download/batch.zip" label="Download All Certificates" /> },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50" role="main">
      <AccessibilityHelper />
      <h1 className="text-3xl font-bold text-center">Certificate Generator Web App</h1>
      <p className="mt-4 text-center text-gray-600">Welcome! Start building your certificate generator workflow.</p>
      <div className="mt-8 w-full max-w-2xl">
        <Wizard>
          {steps[currentStep].component}
        </Wizard>
        <div className="flex justify-between mt-4">
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
        <div className="mt-2 text-center text-gray-400 text-xs">Progress: {currentStep + 1} / {steps.length}</div>
      </div>
    </main>
  );
}

export default App;
