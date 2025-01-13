import { ChatPanel } from "@/components/chat/ChatPanel";
    import { CodePanel } from "@/components/code/CodePanel";
    import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
    import { useIsMobile } from "@/hooks/use-mobile";
    import React, { useState } from 'react';

    const Index = () => {
      const isMobile = useIsMobile();
      const [codeFromAI, setCodeFromAI] = useState<string>('');

      const handleCodeUpdate = (code: string) => {
        setCodeFromAI(code);
      };

      return (
        <div className="h-screen w-full">
          <ResizablePanelGroup
            direction={isMobile ? "vertical" : "horizontal"}
            className="min-h-screen rounded-lg"
          >
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
              <div className="h-full">
                <ChatPanel onCodeUpdate={handleCodeUpdate} />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
              <div className="h-full">
                <CodePanel initialCode={codeFromAI} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      );
    };

    export default Index;
