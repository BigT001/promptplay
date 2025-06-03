"use client"

import { ChevronDown, ChevronRight, FileIcon, FolderIcon, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useState, useRef, useEffect } from "react"

interface ExplorerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onFileClick?: (file: { id: string, name: string, content?: string }) => void
}

interface FileTreeItem {
  name: string
  type: 'file' | 'folder'
  children?: FileTreeItem[]
  id: string // Add unique id for drag and drop
  parentId?: string // Add parent reference for drag and drop
  content?: string
}

// Helper function to generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to add item to tree
function addItemToTree(
  items: FileTreeItem[],
  parentId: string | null,
  newItem: FileTreeItem
): FileTreeItem[] {
  return items.map(item => {
    if (parentId === null) {
      return item;
    }

    if (item.id === parentId) {
      return {
        ...item,
        children: [...(item.children || []), newItem]
      };
    }

    if (item.children) {
      return {
        ...item,
        children: addItemToTree(item.children, parentId, newItem)
      };
    }

    return item;
  });
}

// Helper function to move items
function moveItem(
  items: FileTreeItem[],
  dragId: string,
  dropId: string
): FileTreeItem[] {
  let draggedItem: FileTreeItem | null = null;

  // Find and remove dragged item
  function findAndRemove(items: FileTreeItem[]): FileTreeItem[] {
    return items.filter(item => {
      if (item.id === dragId) {
        draggedItem = item;
        return false;
      }
      if (item.children) {
        item.children = findAndRemove(item.children);
      }
      return true;
    });
  }

  let newItems = findAndRemove([...items]);

  // Add item to new location
  if (draggedItem) {
    newItems = addItemToTree(newItems, dropId, draggedItem);
  }

  return newItems;
}

function renameItem(
  items: FileTreeItem[],
  id: string,
  newName: string
): FileTreeItem[] {
  return items.map(item => {
    if (item.id === id) {
      return { ...item, name: newName };
    }
    if (item.children) {
      return {
        ...item,
        children: renameItem(item.children, id, newName)
      };
    }
    return item;
  });
}

function FileTreeNode({
  item,
  depth = 0,
  onDrop,
  onFileClick,
  files,
  setFiles
}: {
  item: FileTreeItem
  depth?: number
  onDrop: (dragId: string, dropId: string) => void
  onFileClick?: (file: { id: string, name: string, content?: string }) => void
  files: FileTreeItem[]
  setFiles: (files: FileTreeItem[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFolder = item.type === 'folder'

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) return
    if (isFolder) {
      setIsOpen(!isOpen)
    } else if (onFileClick) {
      onFileClick({
        id: item.id,
        name: item.name,
        content: item.content
      })
    }
  }

  const handleRename = () => {
    setIsEditing(true)
  }

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editedName.trim()) {
      setFiles(renameItem(files, item.id, editedName))
      setIsEditing(false)
    }
  }

  const handleRenameBlur = () => {
    if (editedName.trim()) {
      setFiles(renameItem(files, item.id, editedName))
    } else {
      setEditedName(item.name)
    }
    setIsEditing(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isFolder) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dragId = e.dataTransfer.getData('text/plain');
    onDrop(dragId, item.id);
  };

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 text-sm rounded-sm cursor-pointer hover:bg-black/10",
          "transition-colors duration-150"
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        <div
          className="flex items-center gap-1 flex-1"
          onClick={handleClick}
          draggable
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isFolder ? (
            isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />
          ) : <span className="w-4" />}
          {isFolder ? (
            <FolderIcon className="w-4 h-4 shrink-0 text-yellow-400" />
          ) : (
            <FileIcon className="w-4 h-4 shrink-0 text-blue-400" />
          )}
          {isEditing ? (
            <form onSubmit={handleRenameSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleRenameBlur}
                className="w-full bg-[#2d2d2d] px-1 outline-none border border-[#007fd4]"
                onClick={(e) => e.stopPropagation()}
              />
            </form>
          ) : (
            <span className="truncate flex-1">{item.name}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRename}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      </div>
      {isOpen && item.children?.map((child) => (
        <FileTreeNode
          key={child.id}
          item={child}
          depth={depth + 1}
          onDrop={onDrop}
          onFileClick={onFileClick}
          files={files}
          setFiles={setFiles}
        />
      ))}
    </div>
  )
}

const initialDemoFiles: FileTreeItem[] = [];

export function Explorer({ isOpen, setIsOpen, onFileClick }: ExplorerProps) {
  const [files, setFiles] = useState<FileTreeItem[]>(initialDemoFiles);

  const handleNewFolder = () => {
    const newFolder: FileTreeItem = {
      id: generateId(),
      name: 'New Folder',
      type: 'folder',
      children: []
    };
    setFiles([...files, newFolder]);
  };

  const handleNewFile = () => {
    const newFile: FileTreeItem = {
      id: generateId(),
      name: 'New File.txt',
      type: 'file',
      content: ''
    };
    setFiles([...files, newFile]);
  };

  const handleDrop = (dragId: string, dropId: string) => {
    const newFiles = moveItem(files, dragId, dropId);
    setFiles(newFiles);
  };

  return (
    <div className={cn(
      "vscode-sidebar transition-all duration-200 flex flex-col",
      isOpen ? "w-64" : "w-0"
    )}>      <div className="flex items-center justify-between p-2 text-xs font-medium">
        <span className="uppercase text-[#666]">Add</span>
        
        <div className="flex-1 mx-4">
          {/* Spacer */}
        </div>

        <div className="flex items-center gap-1">
          <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleNewFile}
            >
              <FileIcon className="h-3.5 w-3.5" />
            </Button>
            <div className="absolute hidden group-hover:block right-0 top-full 
            mt-1 px-2 py-1 bg-[#252526] text-xs rounded shadow">
              New File
            </div>
          </div>
          
          <div className="relative group">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleNewFolder}
            >
              <FolderIcon className="h-3.5 w-3.5" />
            </Button>
            <div className="absolute hidden group-hover:block right-0 top-full mt-1 px-2 py-1 bg-[#252526] text-xs rounded shadow">
              New Folder
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {files.map((item) => (
            <FileTreeNode
              key={item.id}
              item={item}
              onDrop={handleDrop}
              onFileClick={onFileClick}
              files={files}
              setFiles={setFiles}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
