
export interface Node {
  id: string;
  group: string;
  label: string;
}

export interface Link {
  source: string;
  target: string;
  type: string;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface PatientInfo {
  id?: string;
  name?: string;
  age?: number;
  sex?: string;
}

export interface ImageMetadata {
  modality?: string;
  studyDate?: string;
  bodyPartExamined?: string;
}

export interface Finding {
    finding: string;
    location: string;
    certainty: string;
}

export interface ProcessedImageData {
  patientInfo: PatientInfo;
  imageMetadata: ImageMetadata;
  ocrText: string;
  findings: Finding[];
  summary: string;
  graph: GraphData;
}
