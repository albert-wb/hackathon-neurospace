"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { AddSpaceFormData } from "@/types/database";
import { getCurrentTimeOfDay, getCurrentDayOfWeek } from "@/lib/utils";

interface AddSpaceContextValue {
  formData: AddSpaceFormData;
  updateFormData: (data: Partial<AddSpaceFormData>) => void;
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

const defaultFormData: AddSpaceFormData = {
  // Step 1
  name: "",
  address: "",
  category: "outro",
  latitude: 0,
  longitude: 0,
  timeOfDay: "manha", // Fallback, will be set on init
  dayOfWeek: "semana", // Fallback, will be set on init

  // Step 2
  noiseLevel: 3,
  lightType: "natural",
  lightLevel: 3,
  crowdLevel: 3,
  hasQuietRoom: false,
  hasDimArea: false,
  overallScore: 3,
  comment: "",

  // Step 3
  photos: [],
  audioBlob: null,
};

const AddSpaceContext = createContext<AddSpaceContextValue | undefined>(undefined);

export function AddSpaceProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<AddSpaceFormData>({
    ...defaultFormData,
    timeOfDay: getCurrentTimeOfDay(),
    dayOfWeek: getCurrentDayOfWeek(),
  });
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (data: Partial<AddSpaceFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setFormData({
      ...defaultFormData,
      timeOfDay: getCurrentTimeOfDay(),
      dayOfWeek: getCurrentDayOfWeek(),
    });
    setCurrentStep(1);
  };

  return (
    <AddSpaceContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setStep: setCurrentStep,
        nextStep,
        prevStep,
        resetForm,
      }}
    >
      {children}
    </AddSpaceContext.Provider>
  );
}

export function useAddSpace() {
  const context = useContext(AddSpaceContext);
  if (!context) {
    throw new Error("useAddSpace must be used within AddSpaceProvider");
  }
  return context;
}
