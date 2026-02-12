import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Facebook, Instagram, Loader2, Music2, Search, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";
import AuthMenu from "@/components/AuthMenu";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/useUser";

type AnalyzeResponse = {
  id: string;
  insights: unknown;
  numberOfLikes?: number;
  shared?: number;
};

const platforms = [
  { name: "Instagram", domain: "instagram.com", icon: Instagram },
  { name: "Facebook", domain: "facebook.com", icon: Facebook },
  { name: "TikTok", domain: "tiktok.com", icon: Music2 },
  { name: "YouTube", domain: "youtube.com / youtu.be", icon: Youtube },
];

const Analyze = () => {
  const navigate = useNavigate();
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, isAuthenticated, logout } = useSession();
  const { user } = useUser();

  const handleAnalyze = async () => {
    if (!link.trim()) return;
    setLoading(true);
    try {
      const data = await api.post<AnalyzeResponse>("/analyze", { url: link.trim() });
      navigate("/resultados", { state: { link: link.trim(), analysis: data } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao analisar o post.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.nome || user?.email || session?.usuario.nome || session?.usuario.email || "Utilizador";
  const displayEmail = user?.email || session?.usuario.email;

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Eye className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">OC Tech</span>
          </button>
          <div className="flex items-center gap-3">
            {isAuthenticated && session ? <AuthMenu session={session} onLogout={logout} /> : null}
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          </div>
        </div>
      </nav>

      <div className="container flex flex-col items-center justify-center py-24 md:py-36">
        {!loading ? (
          <div className="w-full max-w-2xl animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">Analisar Publicacao</h1>
            <p className="text-muted-foreground text-center mb-4">Cole o link de um post do Instagram, Facebook, TikTok ou YouTube.</p>
            {isAuthenticated ? (
              <p className="text-center text-sm text-muted-foreground mb-8">
                Sessao ativa: <span className="font-semibold text-foreground">{displayName}</span>
                {displayEmail && displayEmail !== displayName ? ` - ${displayEmail}` : ""}
              </p>
            ) : (
              <div className="mb-8" />
            )}

            <div className="rounded-2xl border border-border/60 bg-card/70 p-6 mb-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Plataformas suportadas</p>
                  <p className="text-xs text-muted-foreground">Aceitamos apenas as redes abaixo.</p>
                </div>
                <span className="text-xs text-muted-foreground">Links oficiais e publicos</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 mt-4">
                {platforms.map((platform) => (
                  <div key={platform.name} className="rounded-xl border border-border/60 bg-background/40 p-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <platform.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{platform.name}</p>
                      <p className="text-xs text-muted-foreground">{platform.domain}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://instagram.com/p/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="flex-1 bg-card border-border h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Button
                onClick={handleAnalyze}
                disabled={!link.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 shrink-0"
              >
                <Search className="h-4 w-4 mr-2" />
                Gerar Insights
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg text-muted-foreground animate-pulse-glow">Analisando comentarios e sentimentos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;



