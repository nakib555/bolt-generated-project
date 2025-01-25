import React, { useState, useEffect, useRef } from 'react';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Send } from "lucide-react";
    import ReactMarkdown from 'react-markdown';
    import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
    import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/hooks/use-toast";
    import { extractCodeFromMarkdown } from "@/lib/utils";
    import { useApiService } from '@/services/apiService';
    import { useChatHistory } from '@/hooks/use-chat-history';

    interface Message {
      sender: 'user' | 'bot';
      text: string;
      displayingText?: string;
    }

    interface ChatPanelProps {
      onCodeUpdate: (code: string) => void;
      chatId: string;
    }

    export const ChatPanel: React.FC<ChatPanelProps> = ({ onCodeUpdate, chatId }) => {
      const [messages, setMessages] = useState<Message[]>([]);
      const [input, setInput] = useState('');
      const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
      const scrollAreaRef = useRef<HTMLDivElement>(null);
      const [selectedModel, setSelectedModel] = useState('gemini-pro');
      const { toast } = useToast();
      const { generateContent, fetchGoogleResults } = useApiService();
      const [searchContext, setSearchContext] = useState<string | null>(null);
      const [isSearching, setIsSearching] = useState(false);
      const { addMessage, getChatMessages } = useChatHistory();

      useEffect(() => {
        const storedMessages = getChatMessages(chatId);
        if (storedMessages) {
          setMessages(storedMessages);
        } else {
          setMessages([{ sender: 'bot', text: "Welcome! I'm your AI assistant. How can I help you today?", displayingText: "Welcome! I'm your AI assistant. How can I help you today?" }]);
        }
      }, [chatId, getChatMessages]);

      const handleSearch = async () => {
        setIsSearching(true);
        try {
          if (!input.trim()) {
            toast({
              title: "Error",
              description: "Please enter a message before searching.",
              variant: "destructive",
            });
            return;
          }
          const searchResults = await fetchGoogleResults(input);
          setSearchContext(searchResults);
        } catch (error: any) {
          console.error("Error fetching Google search results:", error);
          setSearchContext('Error fetching search results.');
          toast({
            title: "Search Error",
            description: error.message || 'Failed to fetch search results.',
            variant: "destructive",
          });
        } finally {
          setIsSearching(false);
        }
      };

      const sendMessage = async () => {
        if (!input.trim()) {
          toast({
            title: "Error",
            description: "Please enter a message.",
            variant: "destructive",
          });
          return;
        }

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        addMessage(chatId, [...messages, userMessage]);
        setInput('');

        try {
          const contextAwareInput = searchContext ? `User query: ${input}\n\nSearch results:\n${searchContext}` : input;
          const botResponse = await generateContent(selectedModel, contextAwareInput);
          const botMessage = { sender: 'bot', text: botResponse, displayingText: '' };
          setMessages(prev => [...prev, botMessage]);
          addMessage(chatId, [...messages, userMessage, botMessage]);
          startTypingAnimation(botResponse);

          const code = extractCodeFromMarkdown(botResponse);
          if (code) {
            onCodeUpdate(code);
          }
        } catch (error: any) {
          console.error('Error sending message:', error);
          toast({
            title: "Error",
            description: error.message || 'Sorry, I encountered an error.',
            variant: "destructive",
          });
          setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error.', displayingText: 'Sorry, I encountered an error.' }]);
        }
        setSearchContext(null);
        setInput('');
      };

      const startTypingAnimation = (text: string) => {
        let index = 0;
        const currentMessage = messages[messages.length - 1];
        if (!currentMessage) return;

        const typing = () => {
          if (index < text.length) {
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], displayingText: text.substring(0, index + 1) };
              return newMessages;
            });
            index++;
            typingTimeoutRef.current = setTimeout(typing, 5);
          }
        };
        typing();
      };

      useEffect(() => {
        return () => {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        };
      }, []);

      useEffect(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, [messages]);

      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
      };

      return (
        <div className="chat-panel h-full flex flex-col">
          <div className="flex-none p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <Select onValueChange={setSelectedModel} defaultValue={selectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-pro">gemini-pro</SelectItem>
                <SelectItem value="gemini-2.0-flash-exp">gemini-2.0-flash-exp</SelectItem>
                <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                 <SelectItem value="gemini-2.0-flash-thinking-exp-1219">gemini-2.0-flash-thinking-exp-1219</SelectItem>
                <SelectItem value="gemini-1.5-flash-8b">gemini-1.5-flash-8b</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={message.sender === 'user' ? 'bg-primary/10 p-3 rounded-lg text-right' : 'bg-secondary p-3 rounded-lg'}
                >
                  {message.sender === 'bot' ? (
                    <div className="whitespace-pre-wrap overflow-x-auto">
                      <ReactMarkdown
                        className="text-sm"
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = (className || '').match(/language-(?<lang>[\w-]+)/);
                            return !inline ? (
                              <pre className="bg-gray-800 text-white p-2 rounded-md overflow-auto" style={{ wordBreak: 'break-word' }}>
                                <SyntaxHighlighter
                                  language={match?.groups?.lang || 'javascript'}
                                  style={dracula}
                                  PreTag="pre"
                                  codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </pre>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-gray-300 pl-4 my-2" {...props} />
                          ),
                          ul: ({node, ...props}) => (
                            <ul className="list-disc list-inside my-2" {...props} />
                          ),
                          ol: ({node, ...props}) => (
                            <ol className="list-decimal list-inside my-2" {...props} />
                          ),
                          strong: ({node, ...props}) => (
                            <strong className="font-bold" {...props} />
                          ),
                          em: ({node, ...props}) => (
                            <em className="italic" {...props} />
                          ),
                          a: ({node, ...props}) => (
                            <a className="text-blue-500 underline" {...props} />
                          ),
                          span: ({node, ...props}) => (
                            <span className="bg-yellow-200" {...props} />
                          )
                        }}
                      >
                        {message.displayingText}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex-none p-4 border-t">
            <div className="flex gap-2 mb-2">
              <Button variant="secondary" size="sm" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            <form className="flex gap-2" onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}>
              <Input 
                placeholder="Type your message..." 
                className="flex-grow"
                value={input}
                onChange={handleInputChange}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      );
    };
