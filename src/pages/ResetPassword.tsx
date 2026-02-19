import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { confirmReset, verifyResetCode } from "@/lib/authService";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("oobCode") ?? searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "invalid">("checking");
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const validateToken = async () => {
      if (!code) {
        if (!isActive) return;
        setTokenStatus("invalid");
        setTokenError("Link nao encontrado.");
        return;
      }

      try {
        await verifyResetCode(code);
        if (!isActive) return;
        setTokenStatus("valid");
        setTokenError(null);
      } catch (err) {
        if (!isActive) return;
        setTokenStatus("invalid");
        setTokenError(
          err instanceof Error ? err.message : "Link invalido ou expirado.",
        );
      }
    };

    validateToken();

    return () => {
      isActive = false;
    };
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error("Link nao encontrado.");
      return;
    }
    if (tokenStatus !== "valid") {
      toast.error(tokenError || "Link invalido.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas nao coincidem.");
      return;
    }

    setLoading(true);
    try {
      await confirmReset(code, password);
      toast.success("Senha redefinida com sucesso.");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="rounded-xl border border-border bg-card p-8 card-glow">
            <div className="text-center mb-8">
              <KeyRound className="h-10 w-10 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Redefinir Senha</h1>
              <p className="text-muted-foreground text-sm mt-1">Defina uma nova palavra-passe para a sua conta.</p>
            </div>

            {tokenStatus === "checking" ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">A validar link...</p>
              </div>
            ) : tokenStatus === "invalid" ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">{tokenError || "Link invalido."}</p>
                <Button variant="outline" onClick={() => navigate("/esqueci-senha")} className="border-border">
                  Pedir novo link
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova palavra-passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary border-border h-11"
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar palavra-passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-secondary border-border h-11"
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Atualizar senha"}
                </Button>
              </form>
            )}

            <div className="text-center mt-6">
              <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Voltar ao login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
