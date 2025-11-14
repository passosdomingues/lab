
import { GoogleGenAI, Type } from '@google/genai';
import type { ProcessedImageData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        patientInfo: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: "Patient ID, if available." },
                name: { type: Type.STRING, description: "Patient Name, if available." },
                age: { type: Type.NUMBER, description: "Patient Age, if available." },
                sex: { type: Type.STRING, description: "Patient Sex, if available." },
            }
        },
        imageMetadata: {
            type: Type.OBJECT,
            properties: {
                modality: { type: Type.STRING, description: "Imaging modality (e.g., CT, MRI, X-RAY)." },
                studyDate: { type: Type.STRING, description: "Date of the study." },
                bodyPartExamined: { type: Type.STRING, description: "The body part being examined." },
            }
        },
        ocrText: { type: Type.STRING, description: "All text extracted from the image via OCR." },
        findings: {
            type: Type.ARRAY,
            description: "A list of clinical findings.",
            items: {
                type: Type.OBJECT,
                properties: {
                    finding: { type: Type.STRING, description: "Description of the finding." },
                    location: { type: Type.STRING, description: "Anatomical location of the finding." },
                    certainty: { type: Type.STRING, description: "Level of certainty (e.g., 'high', 'moderate', 'low')." }
                },
                required: ["finding", "location", "certainty"]
            }
        },
        summary: {
            type: Type.STRING,
            description: "A concise summary of the overall impression from the image analysis."
        },
        graph: {
            type: Type.OBJECT,
            properties: {
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "Unique ID for the node (e.g., patient name, finding, anatomy)." },
                            group: { type: Type.STRING, description: "Category of the node (e.g., 'Patient', 'Anatomy', 'Finding', 'Metadata')." },
                            label: { type: Type.STRING, description: "Display label for the node." }
                        },
                        required: ['id', 'group', 'label']
                    }
                },
                links: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.STRING, description: "ID of the source node." },
                            target: { type: Type.STRING, description: "ID of the target node." },
                            type: { type: Type.STRING, description: "Type of relationship (e.g., 'HAS_FINDING', 'LOCATED_IN')." }
                        },
                        required: ['source', 'target', 'type']
                    }
                }
            },
            required: ['nodes', 'links']
        }
    },
    required: ['patientInfo', 'imageMetadata', 'ocrText', 'findings', 'summary', 'graph']
};

export const processDicomImage = async (files: File[]): Promise<ProcessedImageData> => {
  const imageParts = await Promise.all(files.map(fileToGenerativePart));

  const prompt = `
    You are an expert radiologist and data scientist. Analyze the provided series of medical images, which should be treated as a sequence or stack (e.g., layers of an MRI or CT scan). Perform a comprehensive, multi-dimensional analysis to provide a holistic diagnostic context.

    Your tasks are:
    1.  **Multi-Image OCR:** Perform OCR on ALL images. Aggregate and de-duplicate all extracted text to build a complete textual record.
    2.  **Metadata Extraction:** From the OCR text and image content, identify patient information (ID, name, age, sex) and image metadata (modality, study date, body part).
    3.  **Computational Vision Analysis:** Analyze the images as a collective set. Identify key anatomical structures and any clinical findings (lesions, fractures, anomalies, etc.). Correlate findings across different image slices to understand their 3D structure and location.
    4.  **Diagnostic Summary:** Generate a concise, expert summary of your overall impression from the complete image series. Synthesize information from the visual findings and OCR text.
    5.  **Knowledge Graph Creation:** Create a single, unified knowledge graph representing all entities and their relationships from the entire image set.
        - Node groups must be one of: 'Patient', 'Anatomy', 'Finding', 'Metadata'.
        - Link types should describe the relationship (e.g., 'HAS_FINDING', 'LOCATED_IN', 'HAS_METADATA').
        - Ensure the graph connects findings to their anatomical locations and associates all data with the central patient node.

    Return the entire output as a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting like \`\`\`json.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [...imageParts, { text: prompt }] },
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 32768 }
    },
  });

  try {
    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    return parsedData as ProcessedImageData;
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Could not parse the data from the AI model.");
  }
};
