import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/studios");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-6">
            <Mic2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">V.HUB</h1>
          <p className="text-muted-foreground text-sm">
            Estudio virtual de dublagem
          </p>
        </div>

        <div className="vhub-card-glass rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-foreground">Bem-vindo de volta</h2>
            <p className="text-sm text-muted-foreground">
              Acesse seu espaco de trabalho V.HUB
            </p>
          </div>

          <Button
            className="w-full vhub-btn-md vhub-btn-primary"
            data-testid="button-login-replit"
            onClick={() => { window.location.href = "/api/login"; }}
          >
            Entrar com Replit
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Ao entrar, voce concorda com nossos termos de uso da plataforma V.HUB.
          </p>
        </div>
      </div>
    </div>
  );
}
