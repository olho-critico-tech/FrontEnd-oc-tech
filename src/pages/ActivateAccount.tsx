import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

const ActivateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (!token) return;

    const activate = async () => {
      setStatus("loading");
      try {
        await api.get(`/auth/activate?token=${encodeURIComponent(token)}`);
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } catch (err) {
        setStatus("error");
        toast.error(err instanceof Error ? err.message : "Erro ao ativar conta.");
      }
    };

    activate();
  }, [token, navigate]);

  const showActions = !token || status === "error";

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:h-16">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Eye className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">OC Tech</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="rounded-xl border border-border bg-card p-8 card-glow text-center">
            <MailCheck className="h-14 w-14 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Ativacao de Conta</h1>
            {!token ? (
              <p className="text-muted-foreground text-sm mb-6">Verifique o link enviado no seu email</p>
            ) : status === "loading" ? (
              <p className="text-muted-foreground text-sm mb-6">A ativar a sua conta...</p>
            ) : status === "success" ? (
              <p className="text-muted-foreground text-sm mb-6">Conta ativada com sucesso. A redirecionar para o login...</p>
            ) : (
              <p className="text-muted-foreground text-sm mb-6">Nao foi possivel ativar a conta. Tente novamente.</p>
            )}

            {showActions ? (
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full">Ir para o login</Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                    Voltar ao inicio
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;

