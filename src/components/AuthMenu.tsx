import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionInfo } from "@/lib/auth";

const resolveDisplayName = (session: SessionInfo) => {
  return session.usuario.nome || session.usuario.email || session.usuario.phone || "Sessao ativa";
};

type AuthMenuProps = {
  session: SessionInfo;
  onLogout: () => Promise<void>;
};

const AuthMenu = ({ session, onLogout }: AuthMenuProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const displayName = resolveDisplayName(session);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onLogout();
      toast.success("Sessao terminada.");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao terminar sessao.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <User className="h-4 w-4 mr-2" />
          {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={loading} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          {loading ? "A terminar..." : "Terminar sessao"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthMenu;

