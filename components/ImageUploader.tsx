
import React, { useState, useCallback, useRef } from 'react';
import { IconUpload, IconFiles, IconX } from './IconComponents';

interface ImageUploaderProps {
  onProcess: (files: File[]) => void;
  onReset: () => void;
  disabled: boolean;
  currentFiles: File[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onProcess, onReset, disabled, currentFiles }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        onProcess(imageFiles);
      } else {
        alert('Please upload at least one valid image file.');
      }
    }
  }, [onProcess]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  if (currentFiles.length > 0) {
    return (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <IconFiles className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300 font-medium">{currentFiles.length} image{currentFiles.length > 1 ? 's' : ''} selected</span>
                </div>
                <button
                    onClick={onReset}
                    disabled={disabled}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
                    aria-label="Remove files"
                >
                    <IconX className="h-5 w-5" />
                </button>
            </div>
            <ul className="mt-3 pl-9 text-sm text-gray-400 max-h-24 overflow-y-auto space-y-1">
                {currentFiles.map(file => (
                    <li key={file.name + file.size} className="truncate">{file.name}</li>
                ))}
            </ul>
        </div>
    );
  }

  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="relative w-full text-center">
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${dragActive ? 'border-blue-500 bg-gray-800' : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <IconUpload className={`w-10 h-10 mb-3 transition-colors ${dragActive ? 'text-blue-400' : 'text-gray-500'}`} />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Upload multiple images (PNG, JPG, etc.) for layered analysis</p>
        </div>
      </label>
      {dragActive && <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full" onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
    </form>
  );
};
