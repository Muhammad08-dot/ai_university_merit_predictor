"use client";

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
}

const stepIcons = ["📝", "🎯", "🏫", "📊", "🏆"];

export default function StepWizard({ currentStep, totalSteps, stepLabels, onStepClick }: StepWizardProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      isCompleted || isActive ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onStepClick && onStepClick(step)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 flex-shrink-0 cursor-pointer hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 scale-110 ring-4 ring-green-100"
                      : isCompleted
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "bg-slate-100 text-slate-500 border-2 border-slate-200 hover:border-green-300"
                  }`}
                  title={`Go to Step ${step}: ${label}`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm sm:text-base">{stepIcons[i]}</span>
                  )}
                </button>
                {i < totalSteps - 1 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      isCompleted ? "bg-gradient-to-r from-emerald-500 to-green-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(step)}
                className={`text-[10px] sm:text-xs mt-2 font-semibold text-center leading-tight hover:underline cursor-pointer ${
                  isActive ? "text-green-700 font-bold" : isCompleted ? "text-green-600" : "text-slate-500"
                }`}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
