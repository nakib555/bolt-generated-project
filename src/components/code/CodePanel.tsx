import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Terminal, X, Search, GitBranch, Settings, ChevronDown, Upload, Download, Plus, ChevronRight, File, Folder } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { fileStructure } from "@/data/fileStructure"; // Assuming fileStructure is still needed

// --- FileExplorer Component (Consolidated) ---
type FileType = "file" | "folder";

interface FileStructureItem {
  name: string;
  type: FileType;
  content?: string;
  children?: FileStructureItem[];
}

interface FileItemProps {
  item: FileStructureItem;
  level?: number;
  onFileSelect?: (content: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ item, level = 0, onFileSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.type === 'folder' && item.children?.length;

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    } else if (item.content && onFileSelect) {
      onFileSelect(item.content);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-0.5 px-2 hover:bg-[#2D2D2D] cursor-pointer text-[13px] text-[#CCCCCC]",
          { 'ml-4': level > 0 }
        )}
        onClick={handleClick}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="h-4 w-4 text-[#CCCCCC]" /> : <ChevronRight className="h-4 w-4 text-[#CCCCCC]" />
        ) : <span className="w-4" />}
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4 mr-1 text-[#C5C5C5]" />
        ) : (
          <File className="h-4 w-4 mr-1 text-[#C5C5C5]" />
        )}
        <span>{item.name}</span>
      </div>
      {isOpen && item.children?.map((child, index) => (
        <FileItem
          key={`${child.name}-${index}`}
          item={child}
          level={level + 1}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

const FileExplorer = ({ fileStructure, onFileSelect }: {
  fileStructure: FileStructureItem[],
  onFileSelect: (content: string) => void
}) => {
  return (
    <div className="h-full overflow-auto">
      {fileStructure.map((item, index) => (
        <FileItem
          key={`${item.name}-${index}`}
          item={item}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
};

// --- CodePreview Component (Consolidated) ---
interface CodePreviewProps {
  content: string;
}

const CodePreview = ({ content }: CodePreviewProps) => {
  const [code, setCode] = useState(content);
  // useToast is not used in CodePreview, removed import if it was here

  useEffect(() => {
    setCode(content);
  }, [content]);

  return (
    <div className="h-full overflow-auto bg-[#1E1E1E]">
      <SyntaxHighlighter
        language="javascript" // Assuming default language is javascript
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '14px',
          lineHeight: '1.5',
          height: '100%',
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: '3em',
          paddingRight: '1em',
          color: '#858585',
          textAlign: 'right',
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};


// --- CodePanel Component ---
interface CodePanelProps {
  initialCode?: string;
}

export const CodePanel: React.FC<CodePanelProps> = ({ initialCode }) => {
  const [selectedFileContent, setSelectedFileContent] = useState<string>(initialCode || '// Click on a file to view its contents');
  const [activeTab, setActiveTab] = useState('Code');
  const [activeExplorerTab, setActiveExplorerTab] = useState('Files');
  const [activeTerminalTab, setActiveTerminalTab] = useState('Bolt Terminal');
  const [isTerminalVisible, setIsTerminalVisible] = useState(true); // State to manage terminal visibility
  const { toast } = useToast(); // useToast is used here

  // Function to toggle terminal visibility
  const toggleTerminal = () => {
    setIsTerminalVisible(!isTerminalVisible);
  };

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1E1E1E] border-b border-[#333333]">
        <div className="flex items-center space-x-2">
          <div className="flex rounded overflow-hidden bg-[#252526]">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 rounded-none text-xs",
                activeTab === 'Code' ? 'bg-[#1E1E1E]' : 'hover:bg-[#2D2D2D]'
              )}
              onClick={() => setActiveTab('Code')}
            >
              Code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 rounded-none text-xs",
                activeTab === 'Diff' ? 'bg-[#1E1E1E]' : 'hover:bg-[#2D2D2D]'
              )}
              onClick={() => setActiveTab('Diff')}
            >
              Diff
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-3 rounded-none text-xs",
                activeTab === 'Preview' ? 'bg-[#1E1E1E]' : 'hover:bg-[#2D2D2D]'
              )}
              onClick={() => setActiveTab('Preview')}
            >
              Preview
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[#CCCCCC]">
           {/* Toggle Terminal Button */}
           <Button
             variant="ghost"
             size="sm"
             className="h-7 px-2 hover:bg-[#2D2D2D] text-xs"
             onClick={toggleTerminal} // Attach toggle function
           >
            <Terminal className="h-3 w-3 mr-1" /> {isTerminalVisible ? 'Hide Terminal' : 'Show Terminal'} {/* Update button text */}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D] text-xs">
            <Upload className="h-3 w-3 mr-1" /> Sync & Export
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D]">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area (Code/Explorer + Terminal) */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        {/* Top Section: File Explorer and Code Area */}
        <ResizablePanel defaultSize={isTerminalVisible ? 70 : 100} minSize={40}> {/* Adjust size based on terminal visibility */}
          <ResizablePanelGroup direction="horizontal">
            {/* File Explorer */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-[#252526]">
              <div className="flex flex-col h-full">
                {/* Explorer Header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333]">
                   <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-3 rounded-none text-xs uppercase font-semibold",
                          activeExplorerTab === 'Files' ? 'text-white border-b-2 border-[#007ACC]' : 'text-[#CCCCCC] hover:text-white'
                        )}
                        onClick={() => setActiveExplorerTab('Files')}
                      >
                        Files
                      </Button>
                       <Button
                        variant="ghost"
                        size="sm"
                         className={cn(
                          "h-7 px-3 rounded-none text-xs uppercase font-semibold",
                          activeExplorerTab === 'Search' ? 'text-white border-b-2 border-[#007ACC]' : 'text-[#CCCCCC] hover:text-white'
                        )}
                        onClick={() => setActiveExplorerTab('Search')}
                      >
                        Search
                      </Button>
                       <Button
                        variant="ghost"
                        size="sm"
                         className={cn(
                          "h-7 px-3 rounded-none text-xs uppercase font-semibold",
                          activeExplorerTab === 'Locks' ? 'text-white border-b-2 border-[#007ACC]' : 'text-[#CCCCCC] hover:text-white'
                        )}
                        onClick={() => setActiveExplorerTab('Locks')}
                      >
                        Locks
                      </Button>
                   </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-1 hover:bg-[#2D2D2D]">
                      <Search className="h-4 w-4 text-[#CCCCCC]" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-1 hover:bg-[#2D2D2D]">
                      <GitBranch className="h-4 w-4 text-[#CCCCCC]" />
                    </Button>
                  </div>
                </div>
                {/* File Explorer Content (only Files is functional) */}
                {activeExplorerTab === 'Files' && (
                   <FileExplorer
                    fileStructure={fileStructure}
                    onFileSelect={setSelectedFileContent}
                  />
                )}
                 {activeExplorerTab === 'Search' && (
                   <div className="p-3 text-xs text-[#CCCCCC]">Search functionality placeholder.</div>
                 )}
                 {activeExplorerTab === 'Locks' && (
                   <div className="p-3 text-xs text-[#CCCCCC]">Locks functionality placeholder.</div>
                 )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-[#333333] w-[1px]" />

            {/* Code Area */}
            <ResizablePanel defaultSize={80}>
              <CodePreview content={selectedFileContent} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        {/* Conditionally render the handle and terminal panel */}
        {isTerminalVisible && (
          <>
            <ResizableHandle withHandle className="bg-[#333333] h-[1px]" />
            {/* Bottom Section: Terminal */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="flex flex-col h-full bg-[#000000] text-[#CCCCCC] font-mono text-sm">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333]">
                  <div className="flex items-center space-x-4">
                     <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-3 rounded-none text-xs",
                          activeTerminalTab === 'Bolt Terminal' ? 'text-white border-b-2 border-[#007ACC]' : 'text-[#CCCCCC] hover:text-white'
                        )}
                        onClick={() => setActiveTerminalTab('Bolt Terminal')}
                      >
                        <Terminal className="h-3 w-3 mr-1 text-[#007ACC]" /> Bolt Terminal
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-7 px-3 rounded-none text-xs",
                          activeTerminalTab === 'Terminal' ? 'text-white border-b-2 border-[#007ACC]' : 'text-[#CCCCCC] hover:text-white'
                        )}
                        onClick={() => setActiveTerminalTab('Terminal')}
                      >
                        <Terminal className="h-3 w-3 mr-1 text-[#007ACC]" /> Terminal
                      </Button>
                       <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D]">
                        <Plus className="h-4 w-4 text-[#CCCCCC]" />
                      </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-[#2D2D2D]">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Terminal Content Placeholder */}
                <div className="flex-1 p-3 overflow-auto">
                  {activeTerminalTab === 'Bolt Terminal' && (
                    <>
                      <p className="text-[#00FF00]">$ <span className="text-white">user@project</span>:~$ </p>
                      <p>Welcome to the integrated Bolt terminal placeholder.</p>
                      <p>This area will display terminal output and allow command input.</p>
                      <br/>
                      <p className="text-[#00FF00]">$ <span className="text-white">user@project</span>:~$ </p>
                    </>
                  )}
                   {activeTerminalTab === 'Terminal' && (
                    <>
                      <p className="text-[#00FF00]">$ <span className="text-white">user@project</span>:~$ </p>
                      <p>Welcome to the integrated standard terminal placeholder.</p>
                      <p>This area will display terminal output and allow command input.</p>
                      <br/>
                      <p className="text-[#00FF00]">$ <span className="text-white">user@project</span>:~$ </p>
                    </>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

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
