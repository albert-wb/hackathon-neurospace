"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

interface ReportButtonProps {
  mediaId: string;
  onReport: (mediaId: string) => Promise<void>;
}

export default function ReportButton({ mediaId, onReport }: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    try {
      await onReport(mediaId);
      setReported(true);
      setTimeout(() => setShowModal(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-muted
                   hover:text-danger hover:bg-surface-hover rounded-lg transition-colors"
        aria-label="Sinalizar conteúdo inadequado"
        id={`report-media-${mediaId}`}
        disabled={reported}
      >
        <Flag className="w-3.5 h-3.5" />
        {reported ? "Sinalizado" : "Sinalizar"}
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Sinalizar conteúdo"
        size="sm"
      >
        {reported ? (
          <div className="text-center py-4">
            <p className="text-success font-medium">
              Obrigado por manter a comunidade segura ✓
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-text-muted">
              Este conteúdo é inadequado ou ilegível?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={loading}
                onClick={handleReport}
              >
                Confirmar sinalização
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
