import React, { useState, useEffect, useRef } from 'react';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Send } from "lucide-react";
    import ReactMarkdown from 'react-markdown';
    import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
    import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

    const API_KEY = "AIzaSyBrseV2BcpmajnWNmi8FV4g9AhAEMN3HJ0";

    interface Message {
      sender: 'user' | 'bot';
      text: string;
      displayingText?: string;
    }

    export const ChatPanel = () => {
      const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Welcome! I'm your AI assistant. How can I help you today?", displayingText: "Welcome! I'm your AI assistant. How can I help you today?" },
      ]);
      const [input, setInput] = useState('');
      const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
      const scrollAreaRef = useRef<HTMLDivElement>(null);
      const [selectedModel, setSelectedModel] = useState('gemini-pro');

      const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput(''); // Clear the input field immediately

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: input }],
                }],
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const botResponse = data.candidates[0].content.parts[0].text;
          setMessages(prev => [...prev, { sender: 'bot', text: botResponse, displayingText: '' }]);
          startTypingAnimation(botResponse);
        } catch (error) {
          console.error('Error sending message:', error);
          setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error.', displayingText: 'Sorry, I encountered an error.' }]);
        }
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
            typingTimeoutRef.current = setTimeout(typing, 20);
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
