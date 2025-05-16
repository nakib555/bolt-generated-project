import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Terminal, FolderOpen, ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { FileExplorer } from "./FileExplorer";
import { CodePreview } from "./CodePreview";
import { fileStructure } from "@/data/fileStructure";
import { useToast } from "@/hooks/use-toast";
import { useApiService } from '@/services/apiService';

interface CodePanelProps {
  initialCode?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({ initialCode }) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string>(initialCode || '// Click on a file to view its contents');
  const [codeFromAI, setCodeFromAI] = useState<string>('');
  const [isCodePreviewExpanded, setIsCodePreviewExpanded] = useState(true);
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  const { generateContent } = useApiService();
  const [activeTab, setActiveTab] = useState('code');

  const handleCodeBlockUpdate = (code: string) => {
    setCodeFromAI(code);
  };

  const toggleCodePreview = () => {
    setIsCodePreviewExpanded(!isCodePreviewExpanded);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    try {
      const botResponse = await generateContent('gemini-pro', selectedFileContent);
      setSelectedFileContent(`// API Response:\n${botResponse}`);
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
    <div className="h-full flex flex-col bg-zinc-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-zinc-700">
        <div className="flex items-center space-x-2">
          <div className="flex bg-zinc-800 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1.5 ${activeTab === 'code' ? 'bg-zinc-700' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              Code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1.5 ${activeTab === 'diff' ? 'bg-zinc-700' : ''}`}
              onClick={() => setActiveTab('diff')}
            >
              Diff
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1.5 ${activeTab === 'preview' ? 'bg-zinc-700' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Terminal className="h-4 w-4 mr-2" />
            Toggle Terminal
          </Button>
          <Button variant="ghost" size="sm">
            <FolderOpen className="h-4 w-4 mr-2" />
            Sync & Export
          </Button>
          <Button variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer 
              fileStructure={fileStructure}
              onFileSelect={setSelectedFileContent}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={80}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <CodePreview content={codeFromAI || selectedFileContent} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-zinc-700 bg-zinc-800">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center space-x-4">
            <span>JavaScript</span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};