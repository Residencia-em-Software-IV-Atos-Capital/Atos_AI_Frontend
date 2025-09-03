import { useState } from 'react';
import { PlusIcon, ClockIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

interface SidebarProps {
  onNewChat: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [recentChats] = useState([
    'Relatório do dia 12/08',
    'Dashboard de vendas',
    'Relatório de entradas e saídas'
  ]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    // Esta é a nova div que engloba tudo
    <div className="w-72 h-screen bg-gradient-sidebar flex flex-col shadow-medium">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border-custom">
        <img src="/logo.png" alt="ATOS Capital Logo" className="w-auto h-10" />
      </div>

      {/* Botao de chat */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-transparent border border-sidebar-accent-custom text-sidebar-text hover:bg-sidebar-hover transition-all duration-200"
          variant="outline"
        >
          <PlusIcon className="h-4 w-4" />
          Nova consulta
        </Button>
      </div>


      <div className="flex-1 px-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-sidebar-text/80 mb-3 flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Consultas recentes
          </h3>
          <div className="space-y-2">
            {recentChats.map((chat, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-lg text-sm text-sidebar-text/90 hover:bg-sidebar-hover transition-colors duration-200 hover:text-sidebar-text"
              >
                {chat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botão de tema */}
      <div className="p-4 border-t border-sidebar-border-custom">
        <Button
          onClick={toggleTheme}
          className="w-full justify-start gap-3 bg-transparent text-sidebar-text hover:bg-sidebar-hover transition-all duration-200"
          variant="ghost"
        >
          {theme === 'light' ? (
            <>
              <MoonIcon className="h-4 w-4" />
              Escolha um tema
            </>
          ) : (
            <>
              <SunIcon className="h-4 w-4" />
              Modo claro
            </>
          )}
        </Button>
      </div>
    </div>
  );
}