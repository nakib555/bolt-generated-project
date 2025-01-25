import { CodePanel } from "@/components/code/CodePanel";
    import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
    import { useIsMobile } from "@/hooks/use-mobile";
    import React, { useState } from 'react';
    import ChatDashboard from '@/components/chat/ChatDashboard';
    import Navigation from '@/components/layout/Navigation';
    import { Routes, Route, BrowserRouter } from 'react-router-dom';

    const Index = () => {
      const isMobile = useIsMobile();
      const [codeFromAI, setCodeFromAI] = useState<string>('');

      return (
        <BrowserRouter>
          <Navigation />
          <div className="h-screen w-full">
            <Routes>
              <Route path="/" element={
                <ResizablePanelGroup
                  direction={isMobile ? "vertical" : "horizontal"}
                  className="min-h-screen rounded-lg"
                >
                  <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                    <div className="h-full">
                      <div className="text-center text-gray-500">Home Page</div>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={70}>
                    <div className="h-full">
                      <CodePanel initialCode={codeFromAI} />
                    </div>
                  </ResizablePanel>
                </ResizablePanel>
              } />
              <Route path="/chat" element={
                <ResizablePanelGroup
                  direction={isMobile ? "vertical" : "horizontal"}
                  className="min-h-screen rounded-lg"
                >
                  <ResizablePanel defaultSize={100}>
                    <div className="h-full">
                      <ChatDashboard />
                    </div>
                  </ResizablePanel>
                </ResizablePanel>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      );
    };

    export default Index;
