import { useState, useEffect, useCallback } from 'react';

    interface ChatMessage {
      sender: 'user' | 'bot';
      text: string;
      displayingText?: string;
    }

    interface Chat {
      id: string;
      title: string;
      messages: ChatMessage[];
    }

    const CHAT_HISTORY_KEY = 'chatHistory';

    export const useChatHistory = () => {
      const [chatHistory, setChatHistory] = useState<Chat[]>([]);

      useEffect(() => {
        const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        if (storedHistory) {
          setChatHistory(JSON.parse(storedHistory));
        }
      }, []);

      const saveChatHistory = (updatedHistory: Chat[]) => {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedHistory));
        setChatHistory(updatedHistory);
      };

      const createChat = useCallback(async (id: string, title: string) => {
        const newChat = { id, title, messages: [] };
        saveChatHistory([...chatHistory, newChat]);
      }, [chatHistory, saveChatHistory]);

      const addMessage = useCallback((chatId: string, messages: ChatMessage[]) => {
        const updatedHistory = chatHistory.map(chat =>
          chat.id === chatId ? { ...chat, messages } : chat
        );
        saveChatHistory(updatedHistory);
      }, [chatHistory, saveChatHistory]);

      const getChatMessages = useCallback((chatId: string): ChatMessage[] | undefined => {
        const chat = chatHistory.find(chat => chat.id === chatId);
        return chat?.messages;
      }, [chatHistory]);

      const setChatTitle = useCallback((chatId: string, newTitle: string) => {
        const updatedHistory = chatHistory.map(chat =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        );
        saveChatHistory(updatedHistory);
      }, [chatHistory, saveChatHistory]);

      return {
        chatHistory,
        createChat,
        addMessage,
        getChatMessages,
        setChatTitle,
      };
    };
