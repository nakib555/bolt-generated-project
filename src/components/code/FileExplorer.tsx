import React from 'react';
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const FileExplorer = ({ fileStructure, onFileSelect }: { 
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
