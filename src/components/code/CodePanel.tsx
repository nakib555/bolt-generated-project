import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Terminal, X, Search, GitBranch, Settings, ChevronDown } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { FileExplorer } from "./FileExplorer";
import { CodePreview } from "./CodePreview";
import { fileStructure } from "@/data/fileStructure";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface CodePanelProps {
  initialCode?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({ initialCode }) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string>(initialCode || '// Click on a file to view its contents');
  const [activeTab, setActiveTab] = useState('Code');
  const { toast } = useToast();

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E1E1E] border-b border-[#333333]">
        <div className="flex items-center space-x-2">
          <div className="flex rounded overflow-hidden bg-[#252526]">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 rounded-none ${activeTab === 'Code' ? 'bg-[#1E1E1E]' : 'hover:bg-[#2D2D2D]'}`}
              onClick={() => setActiveTab('Code')}
            >
              Code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 rounded-none ${activeTab === 'Diff' ? 'bg-[#1E1E1E]' : 'hover:bg-[#2D2D2D]'}`}
              onClick={() => setActiveTab('Diff')}
            >
              Diff
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-3 rounded-none ${activeTab === 'Preview' ? 'bg-[#1E1E1E]' : 'hover:bg-[#2D2D2D]'}`}
              onClick={() => setActiveTab('Preview')}
            >
              Preview
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D]">
            <Terminal className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D]">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D]">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-[#252526]">
            <div className="flex flex-col h-full">
              {/* Explorer Header */}
              <div className="p-3 text-xs uppercase text-[#CCCCCC] font-semibold flex items-center justify-between">
                <span>Files</span>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-1 hover:bg-[#2D2D2D]">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-1 hover:bg-[#2D2D2D]">
                    <GitBranch className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <FileExplorer
                fileStructure={fileStructure}
                onFileSelect={setSelectedFileContent}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-[#333333] w-[1px]" />

          {/* Code Area */}
          <ResizablePanel defaultSize={80}>
            <CodePreview content={selectedFileContent} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007ACC] text-white flex items-center px-3 text-xs">
        <div className="flex items-center space-x-3">
          <span>main*</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};