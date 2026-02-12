import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  Facebook,
  Heart,
  Instagram,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Youtube,
  Zap,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthMenu from "@/components/AuthMenu";
import { useSession } from "@/hooks/useSession";

const features = [
  { icon: BarChart3, title: "Analise de Sentimento", description: "Descubra se o publico ama, odeia, ironiza ou ignora o conteudo." },
  { icon: TrendingUp, title: "Gatilhos de Engajamento", description: "Identifique o que faz as pessoas comentar, salvar e partilhar." },
  { icon: Shield, title: "Riscos de Crise", description: "Detecte sinais de cancelamento ou polemicas antes que viralizem." },
  { icon: Heart, title: "Fas vs Haters", description: "Mapeie quem defende, quem ataca e quem so quer palco." },
  { icon: Target, title: "Alinhamento de Persona", description: "Saiba se o conteudo bate com a identidade da marca pessoal." },
  { icon: Zap, title: "Potencial de Monetizacao", description: "Identifique se o conteudo abre portas para marcas e parcerias." },
];

const steps = [
  { number: "01", title: "Cole o Link", description: "Copie o link de um post do Instagram, Facebook, TikTok ou YouTube." },
  { number: "02", title: "Analise Rapida", description: "O sistema processa comentarios, reacoes e sentimentos em segundos." },
  { number: "03", title: "Receba Insights", description: "Obtenha um dashboard completo com metricas, riscos e oportunidades." },
];

const platforms = [
  { name: "Instagram", domain: "instagram.com", icon: Instagram },
  { name: "Facebook", domain: "facebook.com", icon: Facebook },
  { name: "TikTok", domain: "tiktok.com", icon: Music2 },
  { name: "YouTube", domain: "youtube.com / youtu.be", icon: Youtube },
];

const testimonials = [
  {
    name: "Antero Cazemeca",
    role: "Influencer vendedor de produtos de importacao",
    text: "Com o OC Tech consigo ver rapido o que o publico sente e ajustar as ofertas sem perder tempo.",
    stars: 5,
  },
  {
    name: "Manuel Pires",
    role: "CEO",
    text: "Os insights viraram parte do nosso dia a dia. Decidimos com dados, nao com achismo.",
    stars: 5,
  },
  {
    name: "Vivaldo Costa",
    role: "Programador e analista de testes",
    text: "O painel deixou a validacao mais objetiva e diminuiu retrabalho.",
    stars: 5,
  },
  {
    name: "Filipe Antonio",
    role: "Analista de testes",
    text: "Uso os relatorios para priorizar ajustes antes de publicar. Resultado: menos riscos.",
    stars: 5,
  },
  {
    name: "Manuel Cunga",
    role: "Desenvolvedor Frontend",
    text: "O fluxo ficou mais claro e a interface passou a responder bem mesmo com muitos dados.",
    stars: 5,
  },
];

const stats = [
  { value: "100+", label: "Posts analisados" },
  { value: "1M+", label: "Comentarios processados" },
  { value: "98%", label: "Precisao de sentimento" },
  { value: "95%", label: "Satisfacao dos usuarios" },
];

const Index = () => {
  const navigate = useNavigate();
  const { session, isAuthenticated, logout } = useSession();

  const handleStart = () => {
    navigate(isAuthenticated ? "/analisar" : "/login");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16">
          <div className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">OC Tech</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && session ? (
              <AuthMenu session={session} onLogout={logout} />
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-muted-foreground hover:text-foreground">
                  Entrar
                </Button>
                <Button size="sm" onClick={() => navigate("/registar")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-24 md:py-36 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-primary" />
          Inteligencia de Audiencia
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl animate-fade-in leading-tight">
          Transforme comentarios virais em{" "}
          <span className="text-gradient">insights estrategicos.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Cole o link de um post e receba analises detalhadas sobre o seu publico — sentimentos, riscos, oportunidades e muito mais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate("/analisar")} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 py-6">
              Ir para Analise
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={handleStart} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 py-6">
                Comecar Analise
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/registar")} className="border-border text-foreground hover:bg-secondary text-base px-8 py-6">
                Criar Conta Gratis
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Platforms */}
      <section className="container pb-20">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-8 card-glow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Plataformas suportadas</h2>
              <p className="text-sm text-muted-foreground mt-2">A analise aceita apenas estas redes sociais.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Links oficiais e publicos
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platforms.map((platform) => (
              <div key={platform.name} className="rounded-xl border border-border/60 bg-background/40 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <platform.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{platform.name}</p>
                  <p className="text-xs text-muted-foreground">{platform.domain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center animate-fade-in" style={{ animationDelay: `${0.1 * i}s` }}>
              <p className="text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-24 md:py-32">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Tudo o que precisa num so painel</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Cada analise gera um relatorio completo com metricas que realmente importam para a sua estrategia.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 card-glow animate-fade-in" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card/30 border-y border-border/50">
        <div className="container py-24 md:py-32">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">Como Funciona</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Tres passos simples para transformar qualquer post em inteligencia acionavel.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.number} className="text-center animate-fade-in" style={{ animationDelay: `${0.15 * (i + 1)}s` }}>
                <span className="text-5xl font-bold text-primary/20">{s.number}</span>
                <h3 className="text-xl font-semibold mt-2 mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24 md:py-32">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">O que dizem os nossos utilizadores</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Profissionais que ja transformaram a sua estrategia com o OC Tech.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className="rounded-xl border border-border bg-card p-6 card-glow animate-fade-in" style={{ animationDelay: `${0.15 * (i + 1)}s` }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="container py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
            Pronto para ver o que o seu publico <span className="text-gradient">realmente pensa</span>?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Comece gratuitamente. Sem cartao de credito. Resultados em segundos.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/analisar")} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 py-6">
                Ir para Analise
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/registar")} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-base px-8 py-6">
                  Criar Conta Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/analisar")} className="border-border text-foreground hover:bg-secondary text-base px-8 py-6">
                  Experimentar Agora
                </Button>
              </>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Sem cartao de credito</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Resultados imediatos</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancele quando quiser</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          (c) 2026 OC Tech - Olho Critico. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Index;




