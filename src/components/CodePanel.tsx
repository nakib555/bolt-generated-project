import React, { useState } from 'react';
    import { Button } from "@/components/ui/button";
    import { Play, Terminal, FolderOpen, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
    import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
    import { FileExplorer } from "./FileExplorer";
    import { CodePreview } from "./CodePreview";
    import { fileStructure } from "@/data/fileStructure";
    import { useToast } from "@/hooks/use-toast";
    import { ChatPanel } from "./ChatPanel";

    export const CodePanel = () => {
      const [selectedFileContent, setSelectedFileContent] = useState<string>('// Click on a file to view its contents');
      const [codeFromAI, setCodeFromAI] = useState<string>('');
      const [isCodePreviewExpanded, setIsCodePreviewExpanded] = useState(true);
      const { toast } = useToast();
      const [isExecuting, setIsExecuting] = useState(false);

      const handleCodeBlockUpdate = (code: string) => {
        setCodeFromAI(code);
      };

      const toggleCodePreview = () => {
        setIsCodePreviewExpanded(!isCodePreviewExpanded);
      };

      const handleRunCode = async () => {
        setIsExecuting(true);
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB1vl8R0ysWR17-IELYc7Nj71wD5jdtwxI`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: selectedFileContent }],
                }],
              }),
            }
          );

          if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorMessage = errorData.error?.message || errorMessage;
              console.error("API Error Details:", errorData);
            } catch (jsonError) {
              console.error("Failed to parse error JSON:", jsonError);
            }
            setSelectedFileContent(`// API Response Error:\n${errorMessage}`);
            toast({
              title: "API Error",
              description: errorMessage,
              variant: "destructive",
            });
          } else {
            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;
            setSelectedFileContent(`// API Response:\n${botResponse}`);
          }
        } catch (error: any) {
          console.error('Error sending message:', error);
          toast({
            title: "Error",
            description: error.message || 'Sorry, I encountered an error.',
            variant: "destructive",
          });
          setSelectedFileContent(`// API Response Error:\n${error.message || 'Sorry, I encountered an error.'}`);
        } finally {
          setIsExecuting(false);
        }
      };

      const handleClearCode = () => {
        setSelectedFileContent('');
      };

      return (
        <div className="editor-panel h-full flex flex-col">
          <div className="flex-none p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Code Editor</h2>
              <Button variant="secondary" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Files
              </Button>
              <Button variant="secondary" size="sm" onClick={toggleCodePreview}>
                {isCodePreviewExpanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                Preview
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleRunCode} disabled={isExecuting}>
                <Play className="h-4 w-4 mr-2" />
                {isExecuting ? "Running..." : "Run"}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleClearCode}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex-grow">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={25} minSize={20}>
                <FileExplorer 
                  fileStructure={fileStructure}
                  onFileSelect={setSelectedFileContent}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={75}>
                <div className="h-full flex flex-col" style={{ height: isCodePreviewExpanded ? 'auto' : '40px', overflow: 'hidden' }}>
                  <div className="flex-none p-2 border-b border-gray-800">
                    <h3 className="text-sm font-medium">Code Preview</h3>
                  </div>
                  <div className="flex-grow overflow-auto">
                    <CodePreview content={codeFromAI || selectedFileContent} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          <div className="flex-none p-4 border-t border-gray-800">
            <div className="bg-black/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Terminal className="h-4 w-4" />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">Terminal ready</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
