import { useState, useRef } from "react";
import { Camera, X, UploadCloud } from "lucide-react";

interface PhotoUploadProps {
  photos: File[];
  onChange: (photos: File[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({
  photos,
  onChange,
  maxPhotos = 3,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  // Generate previews when photos change
  useState(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combined = [...photos, ...newFiles].slice(0, maxPhotos);
      onChange(combined);

      // Generate previews
      const newUrls = combined.map((file) => URL.createObjectURL(file));
      setPreviews(newUrls);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onChange(newPhotos);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-medium text-text flex items-center gap-2">
          <Camera className="w-5 h-5" /> Fotos do Ambiente
        </label>
        <span className="text-sm text-text-muted">
          {photos.length} de {maxPhotos}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {previews.map((preview, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden border border-border bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`Preview ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(idx)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-danger/80 transition-colors"
              aria-label="Remover foto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors text-text-muted hover:text-primary gap-2"
          >
            <UploadCloud className="w-6 h-6" />
            <span className="text-xs font-medium">Adicionar Foto</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        capture="environment" // Uses rear camera on mobile
        className="hidden"
      />
      
      <p className="text-xs text-text-muted mt-2">
        Evite capturar o rosto de pessoas não envolvidas. Foque na iluminação e na disposição do espaço.
      </p>
    </div>
  );
}
