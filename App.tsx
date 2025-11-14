
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ProcessingView } from './components/ProcessingView';
import { WelcomeScreen } from './components/WelcomeScreen';
import { processDicomImage } from './services/geminiService';
import type { ProcessedImageData } from './types';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedImageData | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageProcess = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setError(null);
    setProcessedData(null);
    setImageFiles(files);

    try {
      const result = await processDicomImage(files);
      setProcessedData(result);
    } catch (err) {
      console.error(err);
      setError('Failed to process image(s). The model may be unable to analyze these files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setProcessedData(null);
    setImageFiles([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
          <ImageUploader onProcess={handleImageProcess} onReset={handleReset} disabled={isLoading} currentFiles={imageFiles} />
          
          {error && (
            <div className="mt-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center animate-fade-in">
              <p className="font-bold">An Error Occurred</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
                <Spinner />
                <p className="mt-4 text-lg font-semibold text-blue-300">Analyzing Image Series...</p>
                <p className="text-gray-400">AI is performing multi-dimensional analysis, OCR, and building the knowledge graph.</p>
              </div>
            ) : processedData && imageFiles.length > 0 ? (
              <ProcessingView data={processedData} imageFiles={imageFiles} />
            ) : (
              !error && <WelcomeScreen />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
