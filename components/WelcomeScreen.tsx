
import React from 'react';
import { IconBrainCircuit, IconFileSearch, IconGraph } from './IconComponents';

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700 animate-fade-in">
      <IconBrainCircuit className="mx-auto h-16 w-16 text-blue-400" />
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">Welcome to the AI DICOM Image Processor</h2>
      <p className="mt-2 text-lg text-gray-400">
        Upload a medical image to begin analysis.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <IconFileSearch className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Comprehensive Analysis</h3>
            <p className="mt-1 text-gray-400">
              Utilizes advanced computational vision and OCR to extract patient data, metadata, and clinical findings from your image.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <IconGraph className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Knowledge Graph Visualization</h3>
            <p className="mt-1 text-gray-400">
             Automatically constructs and displays a Neo4j-style knowledge graph to reveal connections between entities.
            </p>
          </div>
        </div>
      </div>
       <div className="mt-8 text-sm text-gray-500">
        <p>
            Please upload a sample medical image like a CT scan, X-Ray, or MRI to start. For best results, use images that contain some text metadata.
        </p>
        <p className="mt-2">
            This tool is for demonstration purposes only and is not intended for clinical use.
        </p>
      </div>
    </div>
  );
};
