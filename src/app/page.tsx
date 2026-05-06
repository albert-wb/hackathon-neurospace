import Link from "next/link";
import {
  Brain,
  MapPin,
  Volume2,
  Sun,
  Users,
  Shield,
  ArrowRight,
  Mic,
  Camera,
} from "lucide-react";

const features = [
  {
    icon: Volume2,
    title: "Mapeamento de Ruído",
    description:
      "Descubra quais locais são silenciosos ou barulhentos antes de visitá-los.",
    color: "text-[var(--color-sensory-low)]",
    bgColor: "bg-[var(--color-sensory-low)]/10",
  },
  {
    icon: Sun,
    title: "Perfil de Iluminação",
    description:
      "Saiba se o ambiente usa luz natural, quente ou fluorescente agressiva.",
    color: "text-[var(--color-sensory-mid)]",
    bgColor: "bg-[var(--color-sensory-mid)]/10",
  },
  {
    icon: Users,
    title: "Nível de Aglomeração",
    description:
      "Veja a lotação por horário e dia da semana para planejar sua visita.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Mic,
    title: "Áudios do Ambiente",
    description:
      "Ouça gravações reais feitas por outros usuários antes de ir ao local.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Camera,
    title: "Fotos da Comunidade",
    description:
      "Visualize o ambiente real com fotos contribuídas por quem já visitou.",
    color: "text-[var(--color-sensory-low)]",
    bgColor: "bg-[var(--color-sensory-low)]/10",
  },
  {
    icon: Shield,
    title: "Moderação Colaborativa",
    description:
      "A comunidade mantém a qualidade sinalizando conteúdos inadequados.",
    color: "text-[var(--color-sensory-mid)]",
    bgColor: "bg-[var(--color-sensory-mid)]/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Explore o Mapa",
    description:
      "Abra o mapa e veja os pins coloridos por critério sensorial. Filtre por ruído, iluminação ou aglomeração.",
  },
  {
    number: "02",
    title: "Escolha seu Critério",
    description:
      "Selecione o que mais importa para você. As cores mudam em tempo real para refletir sua necessidade.",
  },
  {
    number: "03",
    title: "Contribua com a Comunidade",
    description:
      "Avalie locais, envie fotos e grave áudios do ambiente. Cada contribuição ajuda outra pessoa.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Plataforma neuroinclusiva
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text leading-tight text-balance">
              Navegue a cidade com{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                segurança sensorial
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
              O NeuroSpace mapeia o perfil sensorial de espaços urbanos — ruído,
              iluminação e aglomeração — para que pessoas neurodivergentes possam
              planejar seus trajetos com tranquilidade.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                           bg-primary text-bg font-semibold text-base
                           hover:bg-[var(--color-primary-hover)] transition-colors
                           active:scale-[0.98]"
                id="hero-cta-mapa"
              >
                <MapPin className="w-5 h-5" />
                Explorar Mapa
              </Link>
              <Link
                href="/adicionar"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                           bg-surface border border-border text-text font-semibold text-base
                           hover:bg-surface-hover transition-colors
                           active:scale-[0.98]"
                id="hero-cta-adicionar"
              >
                Contribuir
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-16 pt-8">
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-primary">
                  100%
                </div>
                <div className="text-sm text-text-muted">Gratuito</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-primary">
                  3
                </div>
                <div className="text-sm text-text-muted">
                  Critérios sensoriais
                </div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-primary">
                  24/7
                </div>
                <div className="text-sm text-text-muted">Dados por período</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">
              Informação sensorial que{" "}
              <span className="text-primary">faz a diferença</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Cada detalhe importa quando se trata de conforto sensorial. O
              NeuroSpace captura o que outros mapas ignoram.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-surface border border-border
                           hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5
                           transition-all duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor} mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text mb-4">
              Como funciona
            </h2>
            <p className="text-text-muted text-lg">
              Simples, intuitivo e projetado para reduzir carga cognitiva.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex gap-6 items-start p-6 rounded-xl bg-surface border border-border"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
                  <span className="font-heading text-xl font-bold text-primary">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-11 mt-14 w-0.5 h-8 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-accent/10 border border-border">
            <Brain className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text mb-4">
              Pronto para navegar com mais tranquilidade?
            </h2>
            <p className="text-text-muted mb-8 max-w-lg mx-auto">
              Junte-se à comunidade que está tornando as cidades mais acessíveis
              para pessoas neurodivergentes.
            </p>
            <Link
              href="/mapa"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                         bg-primary text-bg font-semibold text-base
                         hover:bg-[var(--color-primary-hover)] transition-colors
                         active:scale-[0.98]"
              id="final-cta-mapa"
            >
              <MapPin className="w-5 h-5" />
              Abrir o Mapa
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-heading font-semibold text-text">
              NeuroSpace
            </span>
          </div>
          <p className="text-sm text-text-muted">
            Feito com cuidado para a comunidade neurodivergente.
          </p>
        </div>
      </footer>
    </div>
  );
}
