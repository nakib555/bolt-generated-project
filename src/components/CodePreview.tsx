import React, { useState, useRef, useEffect } from 'react';
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { useToast } from "@/hooks/use-toast";
    import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
    import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

    interface CodePreviewProps {
      content: string;
    }

    export const CodePreview = ({ content }: CodePreviewProps) => {
      const [code, setCode] = useState(content);
      const contentRef = useRef<HTMLDivElement>(null);
      const { toast } = useToast();
      const [lineNumbers, setLineNumbers] = useState<string[]>([]);

      const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
        setCode(event.target.innerText);
      };

      useEffect(() => {
        if (contentRef.current) {
          contentRef.current.innerText = content;
          setCode(content);
          updateLineNumbers(content);
        }
      }, [content]);

      const updateLineNumbers = (text: string) => {
        const lines = text.split('\n');
        setLineNumbers(lines.map((_, index) => String(index + 1)));
      };

      const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        try {
          handleChange(event as any);
          updateLineNumbers(event.target.innerText);
        } catch (error: any) {
          console.error("Error updating code:", error);
          toast({
            title: "Error",
            description: "Failed to update code.",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="w-full h-full min-h-[200px] font-mono text-sm bg-transparent outline-none whitespace-pre-wrap overflow-auto flex">
          <div className="flex flex-col items-end pr-2 text-gray-500">
            {lineNumbers.map((number, index) => (
              <span key={index} className="py-0.5">{number}</span>
            ))}
          </div>
          <div
            ref={contentRef}
            className="flex-1 p-4"
            contentEditable
            onBlur={handleBlur}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            <SyntaxHighlighter
              language="javascript"
              style={dracula}
              PreTag="div"
              codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    };
