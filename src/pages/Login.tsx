import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/hooks/useSession";
import AuthMenu from "@/components/AuthMenu";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, isAuthenticated, loading: sessionLoading, logout } = useSession();

  useEffect(() => {
    if (sessionLoading) return;
    if (isAuthenticated) {
      toast.success("Sessao ja iniciada.");
      navigate("/analisar", { replace: true });
    }
  }, [isAuthenticated, sessionLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || sessionLoading || isAuthenticated) return;
    setLoading(true);
    try {
      await api.post("/auth/login", {
        email,
        senha: password,
      });
      toast.success("Sessao iniciada com sucesso!");
      navigate("/analisar");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao iniciar sessao.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Eye className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">OC Tech</span>
          </Link>
          {isAuthenticated && session ? <AuthMenu session={session} onLogout={logout} /> : null}
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-8 card-glow">
            {isAuthenticated && session ? (
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Sessao ativa</h1>
                <p className="text-muted-foreground text-sm">
                  {session.usuario.nome || session.usuario.email || "Utilizador"}
                </p>
                {session.usuario.email ? <p className="text-muted-foreground text-sm">{session.usuario.email}</p> : null}
                <div className="pt-2">
                  <Button onClick={() => navigate("/analisar")} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                    Ir para Analise
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <LogIn className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h1 className="text-2xl font-bold">Iniciar Sessao</h1>
                  <p className="text-muted-foreground text-sm mt-1">Acesse a sua conta OC Tech</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary border-border h-11"
                      required
                      disabled={sessionLoading || isAuthenticated}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Palavra-passe</Label>
                      <Link to="/esqueci-senha" className="text-xs text-primary hover:underline">
                        Esqueci a palavra-passe
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-secondary border-border h-11"
                      required
                      disabled={sessionLoading || isAuthenticated}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || sessionLoading || isAuthenticated}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {loading || sessionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Ainda nao tem conta?{" "}
                  <Link to="/registar" className="text-primary hover:underline font-medium">
                    Criar conta
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


