import { createContext, useState, useEffect, ReactNode } from 'react';
import * as chatService from '../services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatAction {
  type: string;
  data: Record<string, unknown>;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<{ response: string; actions: ChatAction[] } | undefined>;
  resetChat: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const history = await chatService.getChatHistory();
      
      const formattedMessages = history.map((item) => [
        {
          id: crypto.randomUUID(),
          text: item.message,
          sender: 'user' as const,
          timestamp: new Date(item.timestamp)
        },
        {
          id: crypto.randomUUID(),
          text: item.response,
          sender: 'bot' as const,
          timestamp: new Date(item.timestamp)
        }
      ]).flat();
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send message to backend
      const data = await chatService.sendMessage(message);
      
      // Add bot message to chat
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      return data;
    } catch (error) {
      console.error('Error:', error);
      addErrorMessage();
    } finally {
      setIsLoading(false);
    }
  };

  const addErrorMessage = () => {
    const errorMessage: Message = {
      id: crypto.randomUUID(),
      text: 'Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn.',
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, errorMessage]);
  };

  const resetChat = async (): Promise<void> => {
    try {
      await chatService.resetChat();
      setMessages([]);
    } catch (error) {
      console.error('Error resetting chat:', error);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext }; 