import { Sidebar } from "../../components/layout/Sidebar";
import { Dashboard } from "../../components/dashboard";

export default function Home() {
  const handleNewChat = () => {
    console.log("Nova consulta criada!");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixa à esquerda */}
      <div className="flex-shrink-0">
        <Sidebar onNewChat={handleNewChat} />
      </div>

      {/* Área principal, à direita do sidebar */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
          <Dashboard />
      </main>
    </div>
  );
}