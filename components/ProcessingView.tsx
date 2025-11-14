
import React, { useState, useMemo, useRef } from 'react';
import type { ProcessedImageData } from '../types';
import { GraphVisualizer, GraphVisualizerHandles } from './GraphVisualizer';
import { ArchitectureView } from './ArchitectureView';
import { IconSearch, IconDownload } from './IconComponents';

interface ProcessingViewProps {
  data: ProcessedImageData;
  imageFiles: File[];
}

type Tab = 'metadata' | 'graph' | 'architecture';

export const ProcessingView: React.FC<ProcessingViewProps> = ({ data, imageFiles }) => {
  const [activeTab, setActiveTab] = useState<Tab>('metadata');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const graphVisualizerRef = useRef<GraphVisualizerHandles>(null);

  const imageUrls = useMemo(() => imageFiles.map(file => URL.createObjectURL(file)), [imageFiles]);
  const { patientInfo, imageMetadata, ocrText, findings, summary, graph } = data;

  const highlightedOcrText = useMemo(() => {
    if (!ocrText || !searchTerm.trim()) {
      return ocrText || "No text detected.";
    }
    try {
      const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
      
      if(!escapedSearchTerm){
          return ocrText;
      }

      const parts = ocrText.split(regex);

      return (
        <>
          {parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
              <mark key={index} className="bg-yellow-400 text-black px-0.5 rounded-sm">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch (e) {
      console.error("Invalid search regex:", e);
      return ocrText;
    }
  }, [ocrText, searchTerm]);
  
  const handleExportSVG = () => {
    const svgElement = graphVisualizerRef.current?.getSVGElement();
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge_graph.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!data.graph) return;
    const jsonString = JSON.stringify(data.graph, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge_graph.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex flex-col items-center justify-center min-h-[300px] lg:min-h-[500px] max-h-[70vh] lg:max-h-[85vh]">
        <p className="text-sm font-semibold text-gray-400 self-start mb-2">Uploaded Images ({selectedImageIndex + 1} / {imageFiles.length})</p>
        <div className="w-full flex-grow flex items-center justify-center overflow-hidden mb-4">
            {imageUrls.length > 0 && <img src={imageUrls[selectedImageIndex]} alt={`Processed medical scan ${selectedImageIndex + 1}`} className="max-w-full max-h-full object-contain rounded-md" />}
        </div>
        {imageUrls.length > 1 && (
            <div className="flex-shrink-0 w-full flex space-x-2 p-2 overflow-x-auto bg-gray-900/50 rounded-md">
                {imageUrls.map((url, index) => (
                    <img
                        key={url}
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 transition-colors ${selectedImageIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-500'}`}
                    />
                ))}
            </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-1 max-h-[70vh] lg:max-h-[85vh] flex flex-col">
        <div className="flex border-b border-gray-700 flex-shrink-0">
          <TabButton name="Analysis & Metadata" tab="metadata" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="Knowledge Graph" tab="graph" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton name="System Architecture" tab="architecture" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          {activeTab === 'metadata' && (
            <div className="space-y-6 animate-fade-in">
              <Section title="Summary">
                <p className="text-gray-300">{summary}</p>
              </Section>
              <Section title="Clinical Findings">
                {findings && findings.length > 0 ? (
                  <ul className="space-y-2">
                    {findings.map((f, i) => (
                      <li key={i} className="bg-gray-700/50 p-3 rounded-md">
                        <p className="font-semibold text-blue-300">{f.finding}</p>
                        <p className="text-sm text-gray-400">Location: {f.location} | Certainty: {f.certainty}</p>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-gray-400">No specific findings were identified.</p>}
              </Section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Patient Info">
                    <MetadataItem label="ID" value={patientInfo.id} />
                    <MetadataItem label="Name" value={patientInfo.name} />
                    <MetadataItem label="Age" value={patientInfo.age} />
                    <MetadataItem label="Sex" value={patientInfo.sex} />
                </Section>
                <Section title="Image Metadata">
                    <MetadataItem label="Modality" value={imageMetadata.modality} />
                    <MetadataItem label="Study Date" value={imageMetadata.studyDate} />
                    <MetadataItem label="Body Part" value={imageMetadata.bodyPartExamined} />
                </Section>
              </div>
              <Section title="OCR Extracted Text">
                <div className="relative mb-2">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <IconSearch className="h-4 w-4 text-gray-500" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search extracted text..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-md py-1.5 pl-9 pr-3 text-sm text-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <pre className="bg-gray-900 p-3 rounded-md text-gray-400 text-xs whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                  {highlightedOcrText}
                </pre>
              </Section>
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="w-full h-[60vh] lg:h-full animate-fade-in flex flex-col">
              <div className="flex-shrink-0 mb-2 flex items-center justify-end space-x-2">
                  <button onClick={handleExportSVG} className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                      <IconDownload className="h-4 w-4" />
                      <span>Export SVG</span>
                  </button>
                  <button onClick={handleExportJSON} className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                      <IconDownload className="h-4 w-4" />
                      <span>Export JSON</span>
                  </button>
              </div>
              <div className="flex-grow w-full h-full min-h-0">
                  <GraphVisualizer ref={graphVisualizerRef} graphData={graph} />
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="w-full h-full animate-fade-in">
              <ArchitectureView />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{name: string, tab: Tab, activeTab: Tab, setActiveTab: (tab: Tab) => void}> = ({name, tab, activeTab, setActiveTab}) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
            activeTab === tab 
            ? 'bg-blue-600/20 text-blue-300 border-b-2 border-blue-400' 
            : 'text-gray-400 hover:bg-gray-700/50'
        }`}
    >
        {name}
    </button>
);

const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div>
      <h3 className="text-lg font-semibold text-gray-200 mb-2 border-b border-gray-700 pb-1">{title}</h3>
      {children}
    </div>
);

const MetadataItem: React.FC<{label: string, value: string | number | undefined}> = ({label, value}) => {
    if (!value && value !== 0) return null;
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}:</span>
            <span className="text-gray-200 font-medium">{String(value)}</span>
        </div>
    )
}
