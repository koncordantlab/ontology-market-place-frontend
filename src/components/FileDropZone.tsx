import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  title: string;
  className?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  acceptedFileTypes = ".txt,.json",
  title,
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-600 font-medium">{title}</p>
    </div>
  );
};