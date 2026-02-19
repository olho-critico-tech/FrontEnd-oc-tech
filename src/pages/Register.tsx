import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { registerWithEmail, registerWithGoogle } from "@/lib/authService";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas nao coincidem.");
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail({ name, email, password });
      toast.success("Conta criada! Enviamos um email de verificacao. Verifique a caixa de entrada e o spam.");
      navigate("/auth/activate");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const user = await registerWithGoogle();
      toast.success(`Conta de ${user.email ?? "utilizador"} criada com sucesso!`);
      navigate("/analisar");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta com Google.");
    } finally {
      setGoogleLoading(false);
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
              <UserPlus className="h-10 w-10 text-primary mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Criar Conta</h1>
              <p className="text-muted-foreground text-sm mt-1">Junte-se ao OC Tech e comece a analisar</p>
            </div>

            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                disabled={googleLoading}
                onClick={handleGoogleRegister}
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
                    Criar conta com Google
                  </span>
                )}
              </Button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="O seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary border-border h-11"
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+351..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-secondary border-border h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimo 8 caracteres"
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
                  placeholder="Repita a palavra-passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary border-border h-11"
                  required
                  minLength={8}
                />
              </div>
              <div className="flex items-start gap-2">
                <div className="text-sm text-muted-foreground leading-5">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="inline text-primary hover:underline">
                        Ler termos e condicoes
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl border border-border/70 bg-gradient-to-b from-card to-card/80 text-foreground shadow-2xl">
                      <DialogHeader>
                        <DialogTitle>Termos e Condicoes de Uso</DialogTitle>
                      </DialogHeader>
                      <div className="mt-2 max-h-[60vh] overflow-y-auto pr-2 text-sm text-muted-foreground space-y-4">
                        <p className="font-medium text-foreground">OC Tech</p>
                        <p>
                          Estes Termos e Condicoes regulam o acesso e uso da plataforma OC Tech ("Plataforma"),
                          operada por OC Tech, com sede em Angola, doravante denominada "Empresa".
                        </p>
                        <p>Ao acessar ou utilizar a Plataforma, o usuario declara que leu, compreendeu e concorda integralmente com estes Termos.</p>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">1. Objeto</h3>
                          <p>
                            A OC Tech e uma plataforma digital de analise de dados e comentarios de redes sociais,
                            utilizando tecnologias de inteligencia artificial para gerar insights estrategicos sobre engajamento,
                            sentimento e comportamento de audiencia.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">2. Elegibilidade</h3>
                          <p>O usuario declara que:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Possui capacidade legal para contratar;</li>
                            <li>Utilizara a Plataforma apenas para fins licitos;</li>
                            <li>Fornecera informacoes verdadeiras, completas e atualizadas.</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">3. Cadastro e Conta</h3>
                          <p>Determinadas funcionalidades da Plataforma poderao exigir a criacao de conta.</p>
                          <p>O usuario e responsavel por:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Manter a confidencialidade das credenciais de acesso;</li>
                            <li>Todas as atividades realizadas sob sua conta;</li>
                            <li>Garantir que seus dados de cadastro estejam corretos.</li>
                          </ul>
                          <p>A Empresa podera suspender ou encerrar contas que violem estes Termos ou apresentem uso indevido.</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">4. Uso da Plataforma</h3>
                          <p>O usuario concorda em nao:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Utilizar a Plataforma para atividades ilegais ou ilicitas;</li>
                            <li>Violar direitos de terceiros;</li>
                            <li>Inserir dados de terceiros sem autorizacao legal;</li>
                            <li>Tentar acessar sistemas internos, servidores ou codigos de forma nao autorizada;</li>
                            <li>Realizar engenharia reversa, copiar ou explorar indevidamente a tecnologia da Plataforma.</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">5. Propriedade Intelectual</h3>
                          <p>
                            Todo o conteudo, software, algoritmos, relatorios, design, marca e tecnologia da OC Tech
                            sao de propriedade exclusiva da Empresa.
                          </p>
                          <p>O usuario recebe apenas uma licenca limitada, nao exclusiva e intransferivel para uso da Plataforma conforme estes Termos.</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">6. Dados e Processamento de Informacoes</h3>
                          <p>A Plataforma podera processar dados fornecidos pelo usuario e dados publicos disponiveis em redes sociais, conforme aplicavel.</p>
                          <p>O usuario declara que possui autorizacao legal para utilizar e analisar os dados inseridos na Plataforma.</p>
                          <p>A Empresa nao se responsabiliza por uso indevido de dados por parte do usuario.</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">7. Planos, Pagamentos e Cancelamento</h3>
                          <p>Caso a Plataforma ofereca planos pagos:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Os valores e condicoes serao informados no momento da contratacao;</li>
                            <li>Os pagamentos poderao ser recorrentes (mensal ou anual);</li>
                            <li>A falta de pagamento podera resultar na suspensao ou cancelamento do acesso.</li>
                          </ul>
                          <p>Cancelamentos poderao ser realizados conforme as regras do plano contratado.</p>
                          <p>Salvo disposicao em contrario, nao ha garantia de reembolso.</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">8. Limitacao de Responsabilidade</h3>
                          <p>A Plataforma fornece analises baseadas em algoritmos e modelos de inteligencia artificial.</p>
                          <p>A Empresa nao garante:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Precisao absoluta das analises;</li>
                            <li>Resultados financeiros, comerciais ou estrategicos;</li>
                            <li>Ausencia de falhas tecnicas ou interrupcoes.</li>
                          </ul>
                          <p>O uso das informacoes geradas e de inteira responsabilidade do usuario.</p>
                          <p>
                            Em nenhuma hipotese a Empresa sera responsavel por danos indiretos, lucros cessantes ou prejuizos
                            decorrentes do uso da Plataforma.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">9. Modificacoes</h3>
                          <p>
                            A Empresa podera alterar estes Termos a qualquer momento. A continuidade do uso da Plataforma
                            apos modificacoes constitui aceitacao automatica dos novos Termos.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">10. Suspensao e Encerramento</h3>
                          <p>A Empresa podera suspender ou encerrar o acesso do usuario em caso de:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Violacao destes Termos;</li>
                            <li>Uso fraudulento ou abusivo;</li>
                            <li>Determinacao legal ou regulatoria.</li>
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-foreground">11. Lei Aplicavel e Foro</h3>
                          <p>Estes Termos sao regidos pelas leis da Republica de Angola.</p>
                          <p>Fica eleito o foro competente em Angola para dirimir quaisquer controversias relacionadas a estes Termos.</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Fechar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Conta"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Ja tem conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Iniciar sessao
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
