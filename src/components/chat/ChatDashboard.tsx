import React, { useState, useEffect } from 'react';
    import { useChatHistory } from '@/hooks/use-chat-history';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Input } from '@/components/ui/input';
    import { ChatPanel } from './ChatPanel';
    import { v4 as uuidv4 } from 'uuid';

    const ChatDashboard = () => {
      const { chatHistory, createChat, getChatMessages, setChatTitle } = useChatHistory();
      const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
      const [newChatTitle, setNewChatTitle] = useState('');
      const [isCreatingChat, setIsCreatingChat] = useState(false);

      const handleSelectChat = (chatId: string) => {
        setSelectedChatId(chatId);
      };

      const handleCreateChat = async () => {
        setIsCreatingChat(true);
        const chatId = uuidv4();
        await createChat(chatId, newChatTitle || 'New Chat');
        setSelectedChatId(chatId);
        setNewChatTitle('');
        setIsCreatingChat(false);
      };

      const handleTitleChange = (chatId: string, newTitle: string) => {
        setChatTitle(chatId, newTitle);
      };

      useEffect(() => {
        if (chatHistory && chatHistory.length > 0 && !selectedChatId) {
          setSelectedChatId(chatHistory[0].id);
        }
      }, [chatHistory, selectedChatId]);

      return (
        <div className="flex h-full">
          <div className="w-64 border-r p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Chat History</h2>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter chat title"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleCreateChat} disabled={isCreatingChat}>
                {isCreatingChat ? 'Creating...' : 'New Chat'}
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {chatHistory && chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${selectedChatId === chat.id ? 'bg-gray-200' : ''}`}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <Input
                      value={chat.title}
                      onChange={(e) => handleTitleChange(chat.id, e.target.value)}
                      className="text-sm font-medium bg-transparent border-none focus:ring-0"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex-1 p-4">
            {selectedChatId ? (
              <ChatPanel chatId={selectedChatId} onCodeUpdate={() => {}} />
            ) : (
              <div className="text-center text-gray-500">Select a chat or create a new one.</div>
            )}
          </div>
        </div>
      );
    };

    export default ChatDashboard;
