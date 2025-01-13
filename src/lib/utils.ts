import { clsx, type ClassValue } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }

    export function extractCodeFromMarkdown(markdown: string): string | null {
      const codeBlockRegex = /```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)\n```/g;
      const match = codeBlockRegex.exec(markdown);
      if (match && match[1]) {
        return match[1].trim();
      }
      return null;
    }
