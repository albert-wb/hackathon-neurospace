import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Trash2, AlertCircle } from "lucide-react";
import Button from "@/components/UI/Button";

interface AudioRecorderProps {
  audioBlob: Blob | null;
  onChange: (blob: Blob | null) => void;
  maxDurationSeconds?: number;
}

export default function AudioRecorder({
  audioBlob,
  onChange,
  maxDurationSeconds = 30,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  // Clean up on unmount only
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        onChange(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDurationSeconds - 1) {
            // Se atingir o limite, paramos usando a ref para evitar problemas de closure
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
              mediaRecorderRef.current.stop();
              setIsRecording(false);
              if (timerRef.current) clearInterval(timerRef.current);
            }
            return maxDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    onChange(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-4">
      <label className="font-medium text-text flex items-center gap-2">
        <Mic className="w-5 h-5" /> Áudio do Ambiente (Amostra de Ruído)
      </label>

      <div className="bg-surface border border-border p-5 rounded-xl">
        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-danger/10 border border-danger/20">
            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {!audioBlob && !isRecording && (
          <div className="text-center">
            <p className="text-sm text-text-muted mb-4">
              Grave uma pequena amostra para que outros entendam o perfil sonoro. Máx {maxDurationSeconds}s.
            </p>
            <Button type="button" onClick={startRecording} className="w-full sm:w-auto">
              <Mic className="w-4 h-4" />
              Iniciar Gravação
            </Button>
          </div>
        )}

        {isRecording && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-3 relative">
              <div className="absolute inset-0 rounded-full border-2 border-danger animate-ping opacity-75" />
              <Mic className="w-8 h-8 text-danger" />
            </div>
            
            <div className="font-heading text-2xl font-bold text-text mb-4">
              {formatTime(recordingTime)}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-bg rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-danger transition-all duration-1000 linear"
                style={{ width: `${(recordingTime / maxDurationSeconds) * 100}%` }}
              />
            </div>

            <Button type="button" variant="danger" onClick={stopRecording} className="w-full sm:w-auto">
              <Square className="w-4 h-4 fill-current" />
              Parar Gravação
            </Button>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-bg p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3 w-full">
                <Play className="w-5 h-5 text-primary" />
                <audio 
                  ref={audioPlayerRef} 
                  src={URL.createObjectURL(audioBlob)} 
                  controls 
                  className="w-full h-8 outline-none" 
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={deleteRecording} className="text-danger hover:text-danger hover:bg-danger/10">
                <Trash2 className="w-4 h-4" />
                Descartar e Gravar Novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
