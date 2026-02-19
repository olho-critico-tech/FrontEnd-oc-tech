import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import AuthMenu from "@/components/AuthMenu";
import { loginWithEmail, loginWithGoogle } from "@/lib/authService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    session,
    isAuthenticated,
    loading: sessionLoading,
    logout,
  } = useSession();

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
      const user = await loginWithEmail(email, password);
      toast.success(
        `Sessao de ${user.email ?? "utilizador"} iniciada com sucesso!`,
      );
      navigate("/analisar");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao iniciar sessao.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (sessionLoading || isAuthenticated) return;
    setGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success(
        `Sessao de ${user.email ?? "utilizador"} iniciada com sucesso!`,
      );
      navigate("/analisar");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao iniciar sessao com Google.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Eye className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">OC Tech</span>
          </Link>
          {isAuthenticated && session ? (
            <AuthMenu session={session} onLogout={logout} />
          ) : null}
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-8 card-glow">
            {isAuthenticated && session ? (
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Sessao ativa</h1>
                <p className="text-muted-foreground text-sm">
                  {session.usuario.nome ||
                    session.usuario.email ||
                    "Utilizador"}
                </p>
                {session.usuario.email ? (
                  <p className="text-muted-foreground text-sm">
                    {session.usuario.email}
                  </p>
                ) : null}
                <div className="pt-2">
                  <Button
                    onClick={() => navigate("/analisar")}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Ir para Analise
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <LogIn className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h1 className="text-2xl font-bold">Iniciar Sessao</h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Acesse a sua conta OC Tech
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={googleLoading || sessionLoading || isAuthenticated}
                    onClick={handleGoogleLogin}
                    className="w-full h-11"
                  >
                    {googleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4"
                        >
                          <path
                            fill="#EA4335"
                            d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.2-5.5 4.2-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.7 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 11.9s4.1 9.2 9.2 9.2c5.3 0 8.8-3.7 8.8-9 0-.6-.1-1.1-.2-1.6H12z"
                          />
                          <path
                            fill="#34A853"
                            d="M3.9 7.2l3.2 2.3c.9-2.1 3-3.5 4.9-3.5 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.7 14.7 2.7 12 2.7c-3.6 0-6.8 2.1-8.1 4.5z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M12 21.1c2.5 0 4.6-.8 6.1-2.2l-2.8-2.3c-.8.5-1.8.9-3.3.9-2.5 0-4.6-1.7-5.4-4l-3.2 2.4c1.3 2.5 4.3 5.2 8.6 5.2z"
                          />
                          <path
                            fill="#4285F4"
                            d="M20.6 12.1c0-.6-.1-1.1-.2-1.6H12v3.9h5.5c-.3 1.5-1.5 2.8-3.1 3.5l2.8 2.3c1.6-1.5 3.4-3.8 3.4-8.1z"
                          />
                        </svg>
                        Entrar com Google
                      </span>
                    )}
                  </Button>
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
                      <Link
                        to="/esqueci-senha"
                        className="text-xs text-primary hover:underline"
                      >
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
                    {loading || sessionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Ainda nao tem conta?{" "}
                  <Link
                    to="/registar"
                    className="text-primary hover:underline font-medium"
                  >
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
