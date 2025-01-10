import React, { useState } from 'react';
    import { ScrollArea } from "@/components/ui/scroll-area";

    interface CodePreviewProps {
      content: string;
    }

    export const CodePreview = ({ content }: CodePreviewProps) => {
      const [code, setCode] = useState(content);

      const handleChange = (event: React.ChangeEvent<HTMLDivElement>) => {
        setCode(event.target.innerText);
      };

      return (
        <div
          className="w-full h-full min-h-[200px] font-mono text-sm bg-transparent outline-none whitespace-pre-wrap overflow-auto p-4"
          contentEditable
          onBlur={handleChange}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {code}
        </div>
      );
    };
