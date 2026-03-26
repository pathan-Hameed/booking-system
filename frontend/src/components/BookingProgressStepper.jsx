import React from 'react';

const BookingProgressStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Service' },
    { id: 2, label: 'Staff' },
    { id: 3, label: 'Slot' },
    { id: 4, label: 'Details' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.id <= currentStep ? 'text-white' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingProgressStepper;