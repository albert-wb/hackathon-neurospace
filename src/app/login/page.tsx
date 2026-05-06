"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/UI/Button";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle } =
    useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/mapa");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === "signin") {
        const { error: err } = await signInWithEmail(email, password);
        if (err) {
          setError(getPortugueseError(err.message));
        } else {
          router.push("/mapa");
        }
      } else {
        const { error: err } = await signUpWithEmail(email, password);
        if (err) {
          setError(getPortugueseError(err.message));
        } else {
          setSuccessMsg(
            "Conta criada! Verifique seu e-mail para confirmar o cadastro."
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text">
            {mode === "signin" ? "Bem-vindo de volta" : "Criar sua conta"}
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            {mode === "signin"
              ? "Entre para contribuir e acessar o mapa completo."
              : "Junte-se à comunidade neurodivergente."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-lg shadow-[var(--color-card-shadow)]">
          {/* Mode tabs */}
          <div className="flex rounded-lg overflow-hidden border border-border mb-6">
            <button
              onClick={() => { setMode("signin"); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-primary text-bg"
                  : "text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
              id="tab-signin"
              aria-selected={mode === "signin"}
              role="tab"
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-primary text-bg"
                  : "text-text-muted hover:text-text hover:bg-surface-hover"
              }`}
              id="tab-signup"
              aria-selected={mode === "signup"}
              role="tab"
            >
              Cadastrar
            </button>
          </div>

          {/* Google OAuth */}
          <Button
            variant="secondary"
            className="w-full mb-4"
            onClick={handleGoogle}
            isLoading={googleLoading}
            id="btn-google-oauth"
            aria-label="Entrar com Google"
          >
            {!googleLoading && (
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continuar com Google
          </Button>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">ou use seu e-mail</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-email"
                className="block text-sm font-medium text-text"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  id="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-bg border border-border
                             text-text placeholder:text-text-muted text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                             transition-colors"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-password"
                className="block text-sm font-medium text-text"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <input
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "signup" ? "Mínimo 8 caracteres" : "••••••••"
                  }
                  required
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  minLength={mode === "signup" ? 8 : undefined}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-bg border border-border
                             text-text placeholder:text-text-muted text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                             transition-colors"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  id="btn-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="flex items-start gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div
                className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20"
                role="status"
                aria-live="polite"
              >
                <span className="text-success text-sm font-medium">✓</span>
                <p className="text-sm text-success">{successMsg}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={submitting}
              id="btn-submit-auth"
            >
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-text-muted mt-4">
          Ao continuar, você concorda com nossos termos de uso e política de
          privacidade.{" "}
          <Link href="/" className="text-primary hover:underline">
            Saiba mais
          </Link>
        </p>
      </div>
    </div>
  );
}

function getPortugueseError(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
  if (msg.includes("Email not confirmed"))
    return "E-mail não confirmado. Verifique sua caixa de entrada.";
  if (msg.includes("User already registered"))
    return "Este e-mail já está cadastrado. Tente fazer login.";
  if (msg.includes("Password should be at least"))
    return "A senha deve ter pelo menos 8 caracteres.";
  if (msg.includes("Unable to validate email"))
    return "E-mail inválido. Verifique o endereço digitado.";
  if (msg.includes("rate limit"))
    return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
  return "Ocorreu um erro. Tente novamente em instantes.";
}
