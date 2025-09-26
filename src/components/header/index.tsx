import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

function Header({ title = "Olá, Usuário!", subtitle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-6 bg-background border-b border-border">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar..."
            className="pl-10 w-64 bg-background border-input focus:border-ring"
          />
        </div>

        
      </div>
    </header>
  );
}

export default Header;