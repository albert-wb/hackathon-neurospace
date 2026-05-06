"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Plus, User, Home } from "lucide-react";

const tabs = [
  { href: "/", label: "Início", Icon: Home },
  { href: "/mapa", label: "Mapa", Icon: Map },
  { href: "/adicionar", label: "Adicionar", Icon: Plus },
  { href: "/perfil", label: "Perfil", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-lg border-t border-border safe-area-pb"
      aria-label="Navegação inferior"
      id="bottom-nav"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              id={`bottom-nav-${label.toLowerCase()}`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-primary" : "text-text-muted"
                }`}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
