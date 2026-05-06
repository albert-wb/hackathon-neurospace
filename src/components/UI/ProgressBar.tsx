interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  labels,
}: ProgressBarProps) {
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Passo ${currentStep} de ${totalSteps}: ${labels[currentStep - 1]}`}
    >
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div
              key={label}
              className="flex flex-col items-center flex-1"
            >
              <div className="flex items-center w-full">
                {/* Connector line (left) */}
                {index > 0 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors duration-300 ${
                      isCompleted || isActive
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  />
                )}

                {/* Step circle */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-bg"
                      : isActive
                      ? "bg-primary text-bg ring-4 ring-primary/20"
                      : "bg-surface border-2 border-border text-text-muted"
                  }`}
                >
                  {isCompleted ? "✓" : stepNum}
                </div>

                {/* Connector line (right) */}
                {index < labels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors duration-300 ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-text"
                    : "text-text-muted"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
