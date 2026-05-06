"use client";

import { AddSpaceProvider } from "@/contexts/AddSpaceContext";
import AddSpaceWizard from "@/components/Form/AddSpaceWizard";

export default function AdicionarPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 md:py-12 bg-bg relative overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <AddSpaceProvider>
          <AddSpaceWizard />
        </AddSpaceProvider>
      </div>
    </div>
  );
}
