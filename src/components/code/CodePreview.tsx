import React, { useState, useRef, useEffect } from 'react';
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { useToast } from "@/hooks/use-toast";
    import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
    import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
    import { Copy, Check } from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';

    interface CodePreviewProps {
      content: string;
      searchQuery?: string;
      caseSensitive?: boolean;
    }

    export const CodePreview = ({ content, searchQuery, caseSensitive }: CodePreviewProps) => {
      const [code, setCode] = useState(content);
      const contentRef = useRef<HTMLDivElement>(null);
      const { toast } = useToast();
      const [lineNumbers, setLineNumbers] = useState<string[]>([]);
      const [highlightedCode, setHighlightedCode] = useState<string>(content);
      const [copied, setCopied] = useState(false);

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

      useEffect(() => {
        if (contentRef.current) {
          highlightSearchTerms();
        }
      }, [searchQuery, caseSensitive, content]);

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

      const highlightSearchTerms = () => {
        let highlighted = content;
        if (searchQuery) {
          const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = caseSensitive ? new RegExp(`(${escapedQuery})`, 'g') : new RegExp(`(${escapedQuery})`, 'gi');
          highlighted = highlighted.replace(regex, '<span class="bg-yellow-200">$&</span>');
        }

        // Highlight single and double quotes
        highlighted = highlighted.replace(/("([^"\\]*(\\.[^"\\]*)*)")/g, '<span class="text-green-400">$&</span>');
        highlighted = highlighted.replace(/(('([^'\\]*(\\.[^'\\]*)*)'))/g, '<span class="text-green-400">$&</span>');

        setHighlightedCode(highlighted);
      };

      const handleCopyCode = async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          toast({
            title: "Copied!",
            description: "Code copied to clipboard.",
          });
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error("Failed to copy code:", error);
          toast({
            title: "Error",
            description: "Failed to copy code to clipboard.",
            variant: "destructive",
          });
        }
      };

      const detectLanguage = (code: string) => {
        const firstLine = code.trim().split('\n')[0];
        if (firstLine.startsWith('//')) {
          const languageMatch = firstLine.match(/\/\/ @language\s*:\s*(\w+)/);
          if (languageMatch && languageMatch[1]) {
            return languageMatch[1];
          }
        }
        return 'javascript';
      };

      const language = detectLanguage(code);

      return (
        <div
          className="w-full h-full min-h-[200px] font-mono text-sm bg-transparent outline-none whitespace-pre-wrap overflow-auto flex"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          <div className="flex flex-col items-end pr-2 text-gray-500">
            {lineNumbers.map((number, index) => (
              <span key={index} className="py-0.5">{number}</span>
            ))}
          </div>
          <div
            ref={contentRef}
            className="flex-1 p-4 relative"
            contentEditable
            onBlur={handleBlur}
          >
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={dracula}
              PreTag="div"
              codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
            >
              {code}
            </SyntaxHighlighter>
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </div>
        </div>
      );
    };
