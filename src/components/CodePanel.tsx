import React, { useState } from 'react';
    import { Button } from "@/components/ui/button";
    import { Play, Terminal, FolderOpen, ChevronDown, ChevronUp } from "lucide-react";
    import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
    import { FileExplorer } from "./FileExplorer";
    import { CodePreview } from "./CodePreview";
    import { fileStructure } from "@/data/fileStructure";

    export const CodePanel = () => {
      const [selectedFileContent, setSelectedFileContent] = useState<string>('// Click on a file to view its contents');
      const [codeFromAI, setCodeFromAI] = useState<string>('');
      const [isCodePreviewExpanded, setIsCodePreviewExpanded] = useState(true);

      const handleCodeBlockUpdate = (code: string) => {
        setCodeFromAI(code);
      };

      const toggleCodePreview = () => {
        setIsCodePreviewExpanded(!isCodePreviewExpanded);
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
            <Button variant="secondary" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
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
