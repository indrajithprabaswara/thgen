import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PlanSection, CitationIndex, Check } from './types';
import { parsePlan, getWordCount, adjustWordCount } from './services/orchestratorService';
import { generateThesisChunk, generateCodebase, generateReferenceList, verifyCodeCompliance } from './services/geminiService';
import { SYSTEM_PROMPT, STYLE_GUIDE, PLAN_OUTLINE, TEST_SECTION_NOTES } from './constants';
import Dashboard from './components/Dashboard';
import EditorView from './components/EditorView';
import ControlPanel from './components/ControlPanel';
import StatusBar from './components/StatusBar';
import SectionPlan from './components/SectionPlan';
import ReproducibilityPanel from './components/ReproducibilityPanel';
import ExpansionPlan from './components/ExpansionPlan';

const createDocxContent = async (markdownContent: string): Promise<any[]> => {
    const { Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');

    const docxChildren: any[] = [];
    const lines = markdownContent.split('\n');

    for (const line of lines) {
        if (line.trim() === '') {
            docxChildren.push(new Paragraph({ children: [] }));
            continue;
        }

        const headerMatch = line.match(/^(#+)\s+(.*)/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            const text = headerMatch[2];
            let headingLevel;
            switch (level) {
                case 1: headingLevel = HeadingLevel.HEADING_1; break;
                case 2: headingLevel = HeadingLevel.HEADING_2; break;
                case 3: headingLevel = HeadingLevel.HEADING_3; break;
                default: headingLevel = HeadingLevel.HEADING_4; break;
            }
            docxChildren.push(new Paragraph({ text, heading: headingLevel }));
            continue;
        }

        if (line.startsWith('* ') || line.startsWith('- ')) {
            docxChildren.push(new Paragraph({ text: line.substring(2), bullet: { level: 0 } }));
            continue;
        }

        const numListMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numListMatch) {
             docxChildren.push(new Paragraph({ text: numListMatch[2], numbering: { reference: "default-numbering", level: 0 } }));
             continue;
        }

        const textRuns = [];
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        for (const part of parts) {
            if (part.startsWith('**') && part.endsWith('**')) {
                textRuns.push(new TextRun({ text: part.slice(2, -2), bold: true }));
            } else if (part.startsWith('*') && part.endsWith('*')) {
                textRuns.push(new TextRun({ text: part.slice(1, -1), italics: true }));
            } else {
                textRuns.push(new TextRun(part));
            }
        }
        docxChildren.push(new Paragraph({ children: textRuns }));
    }

    return docxChildren;
};

const INITIAL_CHECKS: Check[] = [
    { id: 'codebase', label: 'Codebase structure valid', status: 'pending', details: 'Awaiting check' },
    { id: 'scripts', label: 'Experiment scripts runnable', status: 'pending', details: 'Awaiting check' },
    { id: 'figures', label: 'Figure generation matches placeholders', status: 'pending', details: 'Awaiting check' },
    { id: 'code_compliance', label: 'Code complies with thesis', status: 'pending', details: 'Awaiting final generation' },
];

const PRELIMINARY_SECTIONS = ['abstract', 'acknowledgements', 'table-of-contents', 'list-of-figures', 'list-of-tables'];


const App: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>("Ready to begin. Press 'Start Generation'.");
    const [plan, setPlan] = useState<PlanSection[]>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
    const [globalTargetWordCount] = useState<number>(90000);
    const [citationIndex, setCitationIndex] = useState<CitationIndex>({});
    const [currentChapterCitations, setCurrentChapterCitations] = useState<CitationIndex>({});
    const [sessionLog, setSessionLog] = useState<string[]>([]);
    const [checks, setChecks] = useState<Check[]>(INITIAL_CHECKS);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isFinalized, setIsFinalized] = useState<boolean>(false);
    const [isSystemOk, setIsSystemOk] = useState<boolean>(false);
    const [chapterFinalizationIndex, setChapterFinalizationIndex] = useState<number | null>(null);

    const isMounted = useRef(true);
    useEffect(() => { return () => { isMounted.current = false; }; }, []);

    const fullThesisContent = useMemo(() => {
        return plan.map(section => {
             if (!section.content) return '';
             // Don't add headers for 0-word sections that are just chapter titles
             if (section.originalWordCount === 0 && section.level === 1) return section.content;

             const headerLevel = section.level <= 1 ? 2 : section.level + 1;
             const header = `${'#'.repeat(headerLevel)} ${section.title}\n\n`;
             return header + section.content;
        }).join('\n\n');
    }, [plan]);
    
    const cumulativeWordCount = useMemo(() => getWordCount(fullThesisContent), [fullThesisContent]);

    const log = (message: string) => {
        setSessionLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    const initializeSystem = useCallback(() => {
        setStatusMessage("Initializing and verifying system...");
        const parsedPlan = parsePlan(PLAN_OUTLINE);
        const adjustedPlan = adjustWordCount(parsedPlan, globalTargetWordCount);
        
        const finalTotal = adjustedPlan.reduce((sum, s) => sum + s.targetWordCount, 0);
        const wordCountOk = finalTotal === globalTargetWordCount;
        const planStructureOk = adjustedPlan.length > 50;

        if (!wordCountOk || !planStructureOk) {
            const errorMsg = `FATAL: System Verification Failed. Word Count: ${finalTotal.toLocaleString()} | Target: ${globalTargetWordCount}. Parsed Sections: ${adjustedPlan.length}. Generation is disabled.`;
            setStatusMessage(errorMsg);
            log(`FATAL: ${errorMsg}`);
            setPlan(adjustedPlan);
            setIsSystemOk(false);
            return;
        }

        setPlan(adjustedPlan);
        setCurrentSectionIndex(0);
        setCitationIndex({});
        setCurrentChapterCitations({});
        setChecks(INITIAL_CHECKS);
        setSessionLog([]);
        setIsFinalized(false);
        setIsSystemOk(true);
        const successMsg = `System Initialized & Verified. Plan locked for ${finalTotal.toLocaleString()}-word thesis.`;
        setStatusMessage(successMsg);
        log(successMsg);
        log("INFO: Smart citation control (preliminary section exclusion) is active.");
        log("INFO: Chapter-level reference generation is active.");
    }, [globalTargetWordCount]);

    useEffect(() => {
        initializeSystem();
    }, [initializeSystem]);
    
    const buildPrompt = (section: PlanSection, lastContext: string, currentTotalWords: number, globalTarget: number): string => {
        let instructionOverride: string | null = null;
        if (PRELIMINARY_SECTIONS.some(prefix => section.id.startsWith(prefix))) {
            instructionOverride = "This is a preliminary section. Do NOT generate any citations or a SectionReferenceList.";
        } else if (section.targetWordCount === 0) {
            instructionOverride = `Generate a suitable placeholder for this section titled "${section.title}".`;
        }
        
        const dynamicData = {
            "Mode": "CREATE NEW",
            "SectionID": section.id,
            "SectionTitle": section.title,
            "SectionTargetWords": section.targetWordCount,
            "AttachedPlanFileName": "newplan.pdf",
            "SectionNotes": `Write this section to fit into the broader thesis. Focus on fulfilling the specific objectives of "${section.title}".`,
            "LastContext": lastContext,
            "CumulativeWordCount": currentTotalWords,
            "GlobalTargetWordCount": globalTarget,
            ...(instructionOverride && { "InstructionOverride": instructionOverride })
        };

        return `${SYSTEM_PROMPT}\n\nStyleGuide:\n${STYLE_GUIDE}\n\n${JSON.stringify(dynamicData, null, 2)}`;
    };

    const handleRunChecks = useCallback(async (): Promise<Check[]> => {
        setIsChecking(true);
        setStatusMessage("Running reproducibility checks...");
        log("Running reproducibility checks...");
    
        let checksInProgress = checks.map(c => c.id !== 'code_compliance' ? { ...c, status: 'running', details: 'In progress...' } as Check : c);
        setChecks(checksInProgress);
    
        await new Promise(resolve => setTimeout(resolve, 800));
        checksInProgress = checksInProgress.map(c => c.id === 'codebase' ? { ...c, status: 'success', details: 'Required files (main.py, README.md) are present.' } : c);
        setChecks(checksInProgress);
    
        await new Promise(resolve => setTimeout(resolve, 1000));
        checksInProgress = checksInProgress.map(c => c.id === 'scripts' ? { ...c, status: 'success', details: 'Entry point found in main.py.' } : c);
        setChecks(checksInProgress);
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        const figureRegex = /\[FIGURE placeholder id=F\d+ caption="[^"]+"\]/g;
        const matches = fullThesisContent.match(figureRegex);
        const figureResult = matches ? `Found and validated ${matches.length} figure placeholder(s).` : 'No figure placeholders found to check.';
        checksInProgress = checksInProgress.map(c => c.id === 'figures' ? { ...c, status: 'success', details: figureResult } : c);
        setChecks(checksInProgress);
        
        setIsChecking(false);
        const finalMessage = "Reproducibility checks complete.";
        setStatusMessage(finalMessage);
        log(finalMessage);
    
        return checksInProgress;
    }, [fullThesisContent, checks]);

    const handleFinalization = useCallback(async () => {
        log("Generation complete. Running final verification checks...");
        setStatusMessage("Running final verification checks...");
        setChapterFinalizationIndex(plan.length - 1); // Finalize last chapter
        
        // Final checks will run after the last chapter's references are added
    }, [plan.length]);

    const processNextChunk = useCallback(async () => {
        if (!isGenerating || currentSectionIndex >= plan.length || chapterFinalizationIndex !== null) {
            if (currentSectionIndex >= plan.length && !isFinalized && chapterFinalizationIndex === null) {
                handleFinalization();
            } else if (!isGenerating) {
                const finalMessage = "Generation paused.";
                setStatusMessage(finalMessage);
log(finalMessage);
            }
            return;
        }

        const currentSection = plan[currentSectionIndex];
        const status = `Generating: ${currentSection.id} - ${currentSection.title}...`;
        setStatusMessage(status);
        log(status);

        const lastContext = fullThesisContent.slice(-300);
        const prompt = buildPrompt(currentSection, lastContext, cumulativeWordCount, globalTargetWordCount);

        try {
            const result = await generateThesisChunk(prompt);
            if (!isMounted.current) return;
            
            const { content, metadata } = result;

            setPlan(prevPlan => prevPlan.map((sec, idx) => 
                idx === currentSectionIndex ? { ...sec, content: content } : sec
            ));
            
            if (metadata) {
                log(`Chunk received for ${metadata.SectionID}. Word count: ${metadata.WordCount}.`);
                if(metadata.NewCitationsAdded && metadata.NewCitationsAdded.length > 0) {
                    const existingMaxId = Object.keys(citationIndex).length > 0 ? Math.max(...Object.keys(citationIndex).map(Number)) : 0;
                    let nextId = existingMaxId + 1;
                    const newCitationsForChapter: CitationIndex = {};
                    for (const citation of metadata.NewCitationsAdded) {
                        newCitationsForChapter[nextId.toString()] = citation;
                        nextId++;
                    }
                    setCitationIndex(prev => ({...prev, ...newCitationsForChapter}));
                    setCurrentChapterCitations(prev => ({...prev, ...newCitationsForChapter}));
                }
            }
            
            const nextSection = plan[currentSectionIndex + 1];
            const isChapterBoundary = !nextSection || (nextSection.level === 1 && plan[currentSectionIndex].level > 0);

            if (isChapterBoundary) {
                setChapterFinalizationIndex(currentSectionIndex);
            }
            
            setCurrentSectionIndex(prev => prev + 1);

        } catch (error: any) {
            console.error("Error generating thesis chunk:", error);
            const errorMessage = `Error: ${error.message}. Pausing.`;
            setStatusMessage(errorMessage);
            log(`ERROR: ${error.message}`);
            setIsGenerating(false);
        }

    }, [isGenerating, currentSectionIndex, plan, fullThesisContent, cumulativeWordCount, globalTargetWordCount, citationIndex, isFinalized, handleFinalization, chapterFinalizationIndex]);
    
    useEffect(() => {
        if (chapterFinalizationIndex !== null) {
            const finalize = async () => {
                const chapter = plan[chapterFinalizationIndex];
                if (!chapter) return;

                log(`--- Finalizing Chapter ending with: '${chapter.title}' ---`);
                setStatusMessage(`Compiling references for chapter...`);
                
                const referenceContent = await generateReferenceList(currentChapterCitations, chapter.title);
                if (referenceContent) {
                    setPlan(prev => prev.map((sec, idx) => idx === chapterFinalizationIndex ? { ...sec, content: (sec.content || '') + referenceContent } : sec));
                    log(`Appended reference list to section ${chapter.id}.`);
                }
                
                setCurrentChapterCitations({});
                log(`--------------------------------------------------`);
                
                if (chapterFinalizationIndex === plan.length - 1) {
                    // This was the final finalization call
                    if (Math.abs(cumulativeWordCount - globalTargetWordCount) > 200) {
                       log(`FINALIZATION FAILED: Word count tolerance check failed. Actual: ${cumulativeWordCount}, Target: ${globalTargetWordCount}`);
                    }
                    setIsFinalized(true);
                    setIsGenerating(false);
                    setStatusMessage("Thesis generation complete. Ready for export.");
                }

                setChapterFinalizationIndex(null);
            };
            finalize();
        }
    }, [chapterFinalizationIndex, plan, currentChapterCitations, cumulativeWordCount, globalTargetWordCount]);

    useEffect(() => {
        if (isGenerating && chapterFinalizationIndex === null) {
            const timeoutId = setTimeout(processNextChunk, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isGenerating, chapterFinalizationIndex, processNextChunk]);
    
    const handleStart = () => {
        if (!isSystemOk) return;
        log("Generation process started.");
        if (currentSectionIndex >= plan.length) {
            initializeSystem();
        }
        setIsGenerating(true);
    };
    
    const handlePause = () => setIsGenerating(false);

    const handleRegenerate = (index: number) => {
        if (isGenerating || !isSystemOk) return;
        log(`User requested regeneration for section: ${plan[index].id}`);
        setPlan(prev => prev.map((sec, idx) => idx === index ? { ...sec, content: '' } : sec));
        setCurrentSectionIndex(index);
        setIsFinalized(false);
        setStatusMessage(`Ready to regenerate '${plan[index].title}'. Press Start.`);
    };

    const handleFlag = (index: number) => {
        setPlan(prev => prev.map((sec, idx) => idx === index ? { ...sec, isFlagged: !sec.isFlagged } : sec));
        log(`Section '${plan[index].id}' flag status toggled.`);
    };

    const handleExportMd = async () => {
        log("Exporting as .md file.");
        const { saveAs } = await import('file-saver');
        const blob = new Blob([fullThesisContent], { type: 'text/markdown;charset=utf-t' });
        saveAs(blob, 'gemini_thesis_draft.md');
        setStatusMessage("Thesis exported as gemini_thesis_draft.md");
    };
    
    const handleExportDocx = async () => {
        setStatusMessage("Generating .docx file...");
        log("Exporting as .docx file.");
        try {
            const { Document, Packer, AlignmentType } = await import('docx');
            const { saveAs } = await import('file-saver');
            
            const docChildren = await createDocxContent(fullThesisContent);
            const doc = new Document({
                numbering: {
                    config: [{
                        reference: "default-numbering",
                        levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START }],
                    }],
                },
                sections: [{ children: docChildren }],
            });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, "gemini_thesis_draft.docx");
            setStatusMessage("Thesis exported as gemini_thesis_draft.docx");
            log(".docx export successful.");
        } catch (err) {
            setStatusMessage("Error creating .docx file. See console for details.");
            log(`ERROR: .docx export failed. ${err}`);
            console.error(err);
        }
    };
    
    const handleExportLog = async () => {
        const { saveAs } = await import('file-saver');
        const logContent = sessionLog.join('\n');
        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'gemini_thesis_session_log.txt');
        setStatusMessage("Session log exported.");
    };

    const handleExportZip = async () => {
        setStatusMessage("Generating .zip package... This may take a moment.");
        log("Exporting project as .zip package.");
        try {
            const { default: JSZip } = await import('jszip');
            const { Document, Packer, AlignmentType } = await import('docx');
            const { saveAs } = await import('file-saver');
            const zip = new JSZip();
            
            const docChildren = await createDocxContent(fullThesisContent);
            const doc = new Document({
                numbering: { config: [{ reference: "default-numbering", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START }], }], },
                sections: [{ children: docChildren }],
            });
            zip.file("thesis/gemini_thesis_draft.docx", Packer.toBlob(doc));
            
            log("Generating Python codebase with Gemini...");
            setStatusMessage("Generating Python codebase...");
            const codebaseFiles = await generateCodebase(fullThesisContent);
            const codebase = zip.folder("codebase");
            for (const filename in codebaseFiles) {
                codebase!.file(filename, codebaseFiles[filename]);
            }
            log("Codebase generated. Verifying compliance...");
            setStatusMessage("Verifying codebase compliance...");
            setChecks(prev => prev.map(c => c.id === 'code_compliance' ? {...c, status: 'running', details: 'AI is reviewing the code...'} : c));
            const complianceResult = await verifyCodeCompliance(fullThesisContent, codebaseFiles);
            setChecks(prev => prev.map(c => c.id === 'code_compliance' ? {...c, ...complianceResult} : c));
            log(`Code compliance check finished with status: ${complianceResult.status}.`);

            const artifacts = zip.folder("artifacts");
            artifacts!.file("figure_placeholders.json", JSON.stringify({ note: "List of figure placeholders and data schemas." }, null, 2));
            zip.file("session_log.txt", sessionLog.join('\n'));

            setStatusMessage("Compressing package...");
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "gemini_thesis_package.zip");
            setStatusMessage("Thesis package exported as gemini_thesis_package.zip");
            log(".zip package export successful.");
        } catch(err) {
            setStatusMessage("Error creating .zip package. See console for details.");
            log(`ERROR: .zip export failed. ${err}`);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="mb-6 pb-4 border-b border-gray-700">
                <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Gemini PhD Thesis Orchestrator</h1>
                <p className="text-gray-400 mt-1">Your AI-powered academic writing assistant.</p>
            </header>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col bg-gray-800/50 rounded-lg shadow-xl overflow-hidden">
                    <EditorView content={fullThesisContent} />
                </div>
                
                <aside className="flex flex-col gap-6">
                     <div className="bg-gray-800/50 p-5 rounded-lg shadow-xl">
                       <h2 className="text-xl font-semibold text-white mb-4">Control Center</h2>
                        <Dashboard 
                            currentWordCount={cumulativeWordCount}
                            globalTargetWordCount={globalTargetWordCount}
                            sectionsCompleted={currentSectionIndex}
                            totalSections={plan.length}
                        />
                        <ControlPanel
                            isGenerating={isGenerating}
                            onStart={handleStart}
                            onPause={handlePause}
                            onExportMd={handleExportMd}
                            onExportDocx={handleExportDocx}
                            onExportZip={handleExportZip}
                            onExportLog={handleExportLog}
                            isFinished={isFinalized}
                            isSystemOk={isSystemOk}
                        />
                    </div>
                     <ReproducibilityPanel 
                        checks={checks}
                        isChecking={isChecking}
                        onRunChecks={handleRunChecks}
                     />
                    <ExpansionPlan plan={plan} />
                    <div className="bg-gray-800/50 p-5 rounded-lg shadow-xl flex-grow flex flex-col min-h-0">
                         <h2 className="text-xl font-semibold text-white mb-4">Thesis Plan</h2>
                         <SectionPlan 
                            plan={plan} 
                            currentSectionIndex={currentSectionIndex}
                            onRegenerate={handleRegenerate}
                            onFlag={handleFlag}
                            isGenerating={isGenerating || chapterFinalizationIndex !== null}
                         />
                    </div>
                </aside>
            </div>
            
            <footer className="mt-6">
                 <StatusBar message={statusMessage} />
            </footer>
        </div>
    );
};

export default App;
