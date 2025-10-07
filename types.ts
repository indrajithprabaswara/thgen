
export interface PlanSection {
    id: string;
    title: string;
    targetWordCount: number;
    level: number;
    isFlagged?: boolean;
    content?: string;
    originalWordCount?: number;
    expansionJustification?: string;
}

export type CitationIndex = Record<string, string>;

export interface GenerationMetadata {
    SectionID: string;
    WordCount: number;
    CumulativeWordCount?: number;
    Checkpoint?: string;
    NewCitationsAdded?: string[];
    FigurePlaceholders?: string[];
    SectionReferenceList?: string;
    ResearchPerformed?: string[];
    ExpansionJustification?: string;
    CompressionJustification?: string;
}

export type CheckStatus = 'pending' | 'running' | 'success' | 'failure';

export interface Check {
    id: 'codebase' | 'scripts' | 'figures' | 'code_compliance';
    label: string;
    status: CheckStatus;
    details: string;
}
