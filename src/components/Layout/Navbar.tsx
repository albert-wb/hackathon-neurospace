"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/UI/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/mapa", label: "Mapa" },
  { href: "/adicionar", label: "Adicionar" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="NeuroSpace — Página inicial"
            id="navbar-logo"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg text-text tracking-tight">
              Neuro<span className="text-primary">Space</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:text-text hover:bg-surface-hover"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                  id="nav-perfil"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-danger hover:bg-surface-hover transition-colors"
                  aria-label="Sair da conta"
                  id="nav-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-bg hover:bg-[var(--color-primary-hover)] transition-colors"
                id="nav-login"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-hover transition-colors"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              id="mobile-menu-toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-text" />
              ) : (
                <Menu className="w-5 h-5 text-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <nav
            className="md:hidden py-4 border-t border-border animate-slide-up"
            aria-label="Menu mobile"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:text-text hover:bg-surface-hover"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <Link
                    href="/perfil"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover"
                  >
                    <User className="w-4 h-4" />
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-danger hover:bg-surface-hover"
                    aria-label="Sair da conta"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-surface-hover"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
