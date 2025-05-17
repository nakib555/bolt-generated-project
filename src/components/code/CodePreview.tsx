import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useToast } from "@/hooks/use-toast";

interface CodePreviewProps {
  content: string;
}

export const CodePreview = ({ content }: CodePreviewProps) => {
  const [code, setCode] = useState(content);
  const { toast } = useToast();

  useEffect(() => {
    setCode(content);
  }, [content]);

  return (
    <div className="h-full overflow-auto bg-[#1E1E1E]">
      <SyntaxHighlighter
        language="javascript"
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
