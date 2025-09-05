import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Index = () => {
  const [chatKey, setChatKey] = useState(0);

  const handleNewChat = () => {
    setChatKey(prev => prev + 1);
  };

  return (
 
    <div className="bg-background flex w-full h-screen">

      <Sidebar onNewChat={handleNewChat} />
      
      <ChatInterface key={chatKey} userName="Analista" />
    </div>
  );
};

export default Index;