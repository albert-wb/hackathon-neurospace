"use client";

import { useAddSpace } from "@/contexts/AddSpaceContext";
import ProgressBar from "@/components/UI/ProgressBar";
import WizardStep1 from "./WizardStep1";
import WizardStep2 from "./WizardStep2";
import WizardStep3 from "./WizardStep3";
import { useSearchParams } from "next/navigation";

export default function AddSpaceWizard() {
  const { currentStep } = useAddSpace();
  const searchParams = useSearchParams();
  const spaceId = searchParams.get("spaceId");
  const spaceName = searchParams.get("name");

  const isContribution = !!spaceId;

  const totalSteps = 3;
  
  const stepTitles = [
    "Informações Básicas",
    "Perfil Sensorial",
    "Mídias e Publicação",
  ];

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header & Progress */}
      <div className="mb-8 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-text mb-2">
          {isContribution
            ? `Contribuir para: ${spaceName || "Local Existente"}`
            : "Adicionar Novo Espaço"}
        </h1>
        <p className="text-text-muted text-sm mb-6">
          {isContribution
            ? "Adicione sua avaliação sensorial e mídias para enriquecer as informações deste local."
            : "Sua contribuição ajuda outras pessoas neurodivergentes a explorarem a cidade com segurança."}
        </p>
        
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          labels={stepTitles}
        />
      </div>

      {/* Dynamic Form Content */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-lg shadow-[var(--color-card-shadow)] relative overflow-hidden">
        {currentStep === 1 && <WizardStep1 />}
        {currentStep === 2 && <WizardStep2 />}
        {currentStep === 3 && <WizardStep3 />}
      </div>
    </div>
  );
}
