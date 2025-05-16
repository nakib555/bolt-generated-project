import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setCode(content);
    }
  }, [content]);

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

  return (
    <div className="relative w-full h-full bg-zinc-900 text-white">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyCode}
          className="text-zinc-400 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};