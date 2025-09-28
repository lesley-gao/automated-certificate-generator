import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Award, Upload, Palette, Users, Download, CheckCircle, FileText, Settings } from 'lucide-react';
import UploadBackground from './components/UploadBackground/UploadBackground';
import Designer from './components/Designer/Designer';
import Recipients from './components/Recipients/Recipients';
import CustomizeLayout from './components/CustomizeLayout/CustomizeLayout';
import DownloadLink from './components/Download/DownloadLink';
import AccessibilityHelper from './components/AccessibilityHelper';
import { DesignProvider } from './context/DesignContext';
import { RecipientsProvider } from './context/RecipientsContext';

function App() {
  const steps = [
    { 
      label: 'Upload Background', 
      icon: Upload,
      component: <UploadBackground />,
      description: 'Upload your certificate background image'
    },
    { 
      label: 'Design Certificate', 
      icon: Palette,
      component: <Designer />,
      description: 'Customize text and add signatures'
    },
    { 
      label: 'Add Recipients', 
      icon: Users,
      component: <Recipients />,
      description: 'Add recipients manually or import from CSV'
    },
    { 
      label: 'Customize Layout', 
      icon: Settings,
      component: <CustomizeLayout />,
      description: 'Adjust text positions for each recipient'
    },
    { 
      label: 'Preview & Download', 
      icon: Download,
      component: <DownloadLink url="/api/certificates/download/batch.zip" label="Download All Certificates" />,
      description: 'Generate and download certificates'
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <RecipientsProvider>
      <DesignProvider>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" role="main">
      <AccessibilityHelper />
      
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <Award className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Certificate Generator
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Step Navigation */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const isClickable = index <= currentStep || isCompleted;
                  
                  return (
                    <div
                      key={step.label}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
                        ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 
                          isCompleted ? 'bg-green-50 text-green-700 hover:bg-green-100' : 
                          'bg-muted/50 text-muted-foreground hover:bg-muted'}
                        ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                      `}
                      onClick={() => isClickable && setCurrentStep(index)}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                        ${isActive ? 'bg-primary-foreground text-primary' : 
                          isCompleted ? 'bg-green-500 text-white' : 
                          'bg-muted-foreground/20 text-muted-foreground'}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${
                          isActive ? 'text-primary-foreground' : 
                          isCompleted ? 'text-green-700' : 
                          'text-muted-foreground'
                        }`}>
                          {step.label}
                        </div>
                        <div className={`text-xs ${
                          isActive ? 'text-primary-foreground/80' : 
                          isCompleted ? 'text-green-600' : 
                          'text-muted-foreground/70'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  {React.createElement(steps[currentStep].icon, { className: "h-7 w-7" })}
                  {steps[currentStep].label}
                </CardTitle>
                <CardDescription className="text-base">
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[500px]">
                {steps[currentStep].component}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(s => Math.max(s - 1, 0))}
                disabled={currentStep === 0}
                className="px-8"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep(s => Math.min(s + 1, steps.length - 1))}
                disabled={currentStep === steps.length - 1}
                className="px-8"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
      </DesignProvider>
    </RecipientsProvider>
  );
}

export default App;
