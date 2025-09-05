import { useState, useRef, useEffect } from 'react';
import { SendIcon, BarChart3Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  userName?: string;
}

export function ChatInterface({ userName = "Analista" }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "Vou gerar um relatório de vendas para você. Aguarde um momento...",
      "Analisando os dados solicitados. Em breve exibirei os gráficos correspondentes.",
      "Processando sua consulta. Os dashboards serão renderizados automaticamente.",
      `Entendi que você quer "${userMessage}". Vou buscar essas informações no banco de dados.`,
      "Consultando o banco de dados para gerar as visualizações solicitadas..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    // Contêiner principal, agora com flex-1 para ocupar o espaço horizontal restante
    <div className="flex-1 flex flex-col h-screen">
      {/* Cabeçalho da interface - não muda de posição */}
      <div className="p-6 border-b border-border bg-background flex-none">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Atos Chat AI</h1>
          <p className="text-muted-foreground">Gere relatórios e visualizações com IA</p>
        </div>
      </div>

      {/* Área de mensagens - se expande para ocupar o espaço */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-foreground">
                  Olá, {userName}
                </h2>
                <p className="text-lg text-muted-foreground">
                  Como posso ajudar você com seus dados hoje?
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Mostre o faturamento dos últimos 6 meses",
                  "Crie um gráfico de vendas por região",
                  "Analise a taxa de vendas dos produtos",
                  "Me envie as despesas do mês"
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(prompt)}
                    className="p-4 text-left bg-card border border-border rounded-xl hover:bg-accent transition-colors text-sm text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-card border border-border rounded-2xl px-4 py-3 mr-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-muted-foreground">IA está pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {}
      <div className="p-6 border-t border-border bg-background flex-none">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 p-4 bg-card rounded-2xl border border-border shadow-soft">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte ao Atos AI"
              className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-xl px-4 py-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}