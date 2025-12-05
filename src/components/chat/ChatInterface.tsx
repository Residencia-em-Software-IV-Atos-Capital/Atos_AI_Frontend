import { useState, useRef, useEffect } from "react";
import { SendIcon, BarChart3Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./MessageBubble";
import { analyzeData, getCsvReport } from "@/services/atosService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "report" | "chart";
  data?: Record<string, unknown>[] | null;
  visualization_type?: "line" | "bar" | "pie" | null;
  x_axis?: string | null;
  y_axis?: string | null;
  fileUrl?: string;
  fileName?: string;
  fileType?: "pdf" | "excel" | "csv";
}
interface ChatInterfaceProps {
  userName?: string;
}

export function ChatInterface({ userName = "Analista" }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const analysis = await analyzeData(message);

      const aiResponse = typeof analysis === "object" && analysis !== null
        ? analysis as {
          message: string;
          data?: Record<string, unknown>[] | null;
          visualization_type?: "line" | "bar" | "pie" | null;
          x_axis?: string | null;
          y_axis?: string | null;
        }
        : { message: String(analysis) };

      // --- Se for arquivo (PDF ou Excel) ---
      if (analysis?.type === "pdf" || analysis?.type === "excel") {
        const aiMessage: Message = {
          id: (Date.now() + 10).toString(),
          content: analysis.message, // apenas o texto “PDF gerado”
          sender: "ai",
          timestamp: new Date(),
          type: "report",
          fileUrl: analysis.fileUrl,
          fileName: analysis.fileName,
          fileType: analysis.type, // pdf ou excel
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
        return;
      }


      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message || "⚠️ Nenhuma resposta recebida.",
        sender: "ai",
        timestamp: new Date(),
        type: aiResponse.visualization_type ? "chart" : "text",
        data: aiResponse.data ?? null,
        visualization_type: aiResponse.visualization_type ?? null,
        x_axis: aiResponse.x_axis ?? null,
        y_axis: aiResponse.y_axis ?? null,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao chamar API /analyze:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "❌ Ocorreu um erro ao analisar sua solicitação.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleGenerateReport = async () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.sender === "user");

    if (!lastUserMessage) return;

    setIsLoading(true);
    try {
      const report = await getCsvReport(lastUserMessage.content);

      const aiMessage: Message = {
        id: (Date.now() + 3).toString(),
        content:
          report?.file_url
            ? `📊 [Clique aqui para baixar o relatório CSV](${report.file_url})`
            : "📊 Relatório gerado com sucesso! (dados recebidos da API)",
        sender: "ai",
        timestamp: new Date(),
        type: "report",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      const errorMessage: Message = {
        id: (Date.now() + 4).toString(),
        content: "❌ Erro ao gerar o relatório CSV.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full space-y-8 text-center">
              <h2 className="text-4xl font-bold text-foreground">
                Olá, {userName}
              </h2>
              <p className="text-lg text-muted-foreground">
                Como posso ajudar você com seus dados hoje?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {[
                  "Mostre o faturamento dos últimos 6 meses",
                  "Crie um gráfico de vendas por região",
                  "Analise a taxa de vendas dos produtos",
                  "Me envie as despesas do mês",
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
                    <span className="text-sm text-muted-foreground">
                      IA está pensando...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Área de input */}
      <div className="p-6 border-border bg-background flex-none">
        <div className="max-w-4xl mx-auto flex gap-3 p-4 bg-card rounded-2xl border border-border shadow-soft">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pergunte ao Atos AI"
            className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />

          {/* Botão de relatório */}
          <Button
            onClick={handleGenerateReport}
            disabled={isLoading || messages.length === 0}
            variant="secondary"
            className="rounded-xl px-4 py-2"
          >
            <BarChart3Icon className="h-4 w-4" />
          </Button>

          {/* Botão de envio */}
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
  );
}
