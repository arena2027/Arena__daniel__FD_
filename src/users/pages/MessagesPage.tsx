import { useState, useEffect } from 'react';
import { useDetailView } from '../../contexts/DetailViewContext';
import { Chat as ChatType } from '../components/messages/types';
import { Chat, mockChats } from '../components/messages/Chat';

export function MessagesPage() {
  const [activeChat, setActiveChat] = useState<ChatType | null>(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  const { setShowDetailView } = useDetailView();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop && !activeChat) {
      setActiveChat(mockChats[0]);
    }
  }, [isDesktop, activeChat]);

  // Update detail view state when chat is selected on mobile
  useEffect(() => {
    setShowDetailView(activeChat !== null && !isDesktop);
  }, [activeChat, isDesktop, setShowDetailView]);

  const handleBackFromChat = () => {
    setActiveChat(null);
    setShowDetailView(false);
  };

  return (
    <Chat 
      isDesktop={isDesktop} 
      activeChat={activeChat} 
      onSelectChat={setActiveChat} 
      onBack={handleBackFromChat} 
    />
  );
}
