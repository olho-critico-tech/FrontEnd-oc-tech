import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const genericMessage = "Se o e-mail existir, enviaremos o link de redefinicao.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success(genericMessage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar e-mail.");
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
              <h1 className="text-2xl font-bold">Recuperar Palavra-passe</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {sent ? genericMessage : "Insira o e-mail associado a sua conta."}
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar link de recuperacao"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">{genericMessage}</p>
                <Button variant="outline" onClick={() => setSent(false)} className="border-border">
                  Reenviar e-mail
                </Button>
              </div>
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

export default ForgotPassword;
