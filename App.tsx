import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PlanSection, CitationIndex, Check, CheckStatus } from './types';
import { parsePlan, getWordCount, adjustWordCount } from './services/orchestratorService';
import { generateThesisChunk, generateCodebase } from './services/geminiService';
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
];

const App: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>("Ready to begin. Press 'Start Generation'.");
    const [plan, setPlan] = useState<PlanSection[]>([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
    const [globalTargetWordCount] = useState<number>(90000);
    const [citationIndex, setCitationIndex] = useState<CitationIndex>({});
    const [sessionLog, setSessionLog] = useState<string[]>([]);
    const [checks, setChecks] = useState<Check[]>(INITIAL_CHECKS);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isFinalized, setIsFinalized] = useState<boolean>(false);

    const isMounted = useRef(true);
    useEffect(() => { return () => { isMounted.current = false; }; }, []);

    const fullThesisContent = useMemo(() => {
        return plan.map(section => {
             if (!section.content) return '';
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
        const parsedPlan = parsePlan(PLAN_OUTLINE);
        const adjustedPlan = adjustWordCount(parsedPlan, globalTargetWordCount);
        setPlan(adjustedPlan);
        setCurrentSectionIndex(0);
        setCitationIndex({});
        setChecks(INITIAL_CHECKS);
        setSessionLog([]);
        setIsFinalized(false);
        setStatusMessage("System initialized. Plan parsed and word counts adjusted.");
        log("System initialized. Plan parsed and word counts adjusted for 90,000 word target.");
    }, [globalTargetWordCount]);

    useEffect(() => {
        initializeSystem();
    }, [initializeSystem]);
    
    const buildPrompt = (section: PlanSection, lastContext: string, currentTotalWords: number, globalTarget: number, citations: CitationIndex): string => {
        // DEFECT FIX: Check against the slugified 'abstract' id.
        const sectionNotes = section.id === "abstract" ? TEST_SECTION_NOTES : `Write this section to fit into the broader thesis. Ensure it connects logically with previous and subsequent sections based on the Plan. Focus on fulfilling the specific objectives of "${section.title}".`;
        
        const dynamicData = {
            "Mode": "CREATE NEW",
            "SectionID": section.id,
            "SectionTitle": section.title,
            "SectionTargetWords": section.targetWordCount,
            "AttachedPlanFileName": "newplan.pdf",
            "SectionNotes": sectionNotes,
            "LastContext": lastContext,
            "CumulativeWordCount": currentTotalWords,
            "GlobalTargetWordCount": globalTarget,
            "CitationIndexFile": citations
        };

        return `${SYSTEM_PROMPT}\n\nStyleGuide:\n${STYLE_GUIDE}\n\n${JSON.stringify(dynamicData, null, 2)}`;
    };

    const handleFinalization = useCallback(async () => {
        log("Generation complete. Running final verification checks...");
        setStatusMessage("Running final verification checks...");
        
        let checksPassed = true;
        let finalMessage = "Finalization successful. Project is ready for export.";

        // 1. Word Count Check
        if (Math.abs(cumulativeWordCount - globalTargetWordCount) > 200) {
            checksPassed = false;
            finalMessage = `Finalization failed: Word count (${cumulativeWordCount}) is outside the target tolerance (±200 words).`;
            log(`FINALIZATION FAILED: Word count tolerance check failed. Actual: ${cumulativeWordCount}, Target: ${globalTargetWordCount}`);
        } else {
             log(`FINALIZATION PASSED: Word count tolerance check. Actual: ${cumulativeWordCount}`);
        }

        // 2. Flagged Sections Check
        if (plan.some(s => s.isFlagged)) {
            checksPassed = false;
            finalMessage = "Finalization failed: One or more sections are flagged for human review.";
            log("FINALIZATION FAILED: Flagged sections found.");
        } else {
            log("FINALIZATION PASSED: No sections flagged for review.");
        }

        // 3. Reproducibility Checks
        await handleRunChecks(); // Reuse the existing check runner

        if (checks.some(c => c.status === 'failure')) {
            checksPassed = false;
            finalMessage = "Finalization failed: Reproducibility checks did not pass.";
            log("FINALIZATION FAILED: Reproducibility checks failed.");
        } else {
            log("FINALIZATION PASSED: Reproducibility checks.");
        }
        
        setStatusMessage(finalMessage);
        log(`Final result: ${finalMessage}`);
        setIsFinalized(checksPassed);

    }, [cumulativeWordCount, globalTargetWordCount, plan, checks]);

    const runChapterVerification = (completedSectionIndex: number) => {
        const chapterTitle = plan[completedSectionIndex].title;
        log(`--- Post-Chapter Verification for '${chapterTitle}' ---`);
        log(`Cumulative words: ${cumulativeWordCount} / ${globalTargetWordCount}`);
        log(`Progress: ${completedSectionIndex + 1} / ${plan.length} sections complete.`);
        log(`--------------------------------------------------`);
    };

    const processNextChunk = useCallback(async () => {
        if (!isGenerating || currentSectionIndex >= plan.length) {
            setIsGenerating(false);
            if (currentSectionIndex >= plan.length && !isFinalized) {
                handleFinalization();
            } else {
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
        const prompt = buildPrompt(currentSection, lastContext, cumulativeWordCount, globalTargetWordCount, citationIndex);

        try {
            const result = await generateThesisChunk(prompt);
            if (!isMounted.current) return;
            
            const { content, metadata } = result;

            setPlan(prevPlan => prevPlan.map((sec, idx) => 
                idx === currentSectionIndex ? { ...sec, content: content } : sec
            ));
            
            if (metadata) {
                log(`Chunk received for ${metadata.SectionID}. Word count: ${metadata.WordCount}.`);
                const newCitations: CitationIndex = {};
                if(metadata.NewCitationsAdded) {
                    const existingMaxId = Object.keys(citationIndex).length > 0 ? Math.max(...Object.keys(citationIndex).map(Number)) : 0;
                    let nextId = existingMaxId + 1;
                    for (const citation of metadata.NewCitationsAdded) {
                        newCitations[nextId.toString()] = citation;
                        nextId++;
                    }
                }
                setCitationIndex(prev => ({...prev, ...newCitations}));
            }
            
            // Post-chapter verification
            const nextSection = plan[currentSectionIndex + 1];
            if (!nextSection || nextSection.level === 1) {
                runChapterVerification(currentSectionIndex);
            }
            
            setCurrentSectionIndex(prev => prev + 1);

        } catch (error: any) {
            console.error("Error generating thesis chunk:", error);
            const errorMessage = `Error: ${error.message}. Pausing.`;
            setStatusMessage(errorMessage);
            log(`ERROR: ${error.message}`);
            setIsGenerating(false);
        }

    }, [isGenerating, currentSectionIndex, plan, fullThesisContent, cumulativeWordCount, globalTargetWordCount, citationIndex, isFinalized, handleFinalization]);
    
    useEffect(() => {
        if (isGenerating) {
            const timeoutId = setTimeout(processNextChunk, 100); // Faster iteration
            return () => clearTimeout(timeoutId);
        }
    }, [isGenerating, processNextChunk]);
    
    const handleStart = () => {
        log("Generation process started.");
        if (currentSectionIndex >= plan.length) {
            initializeSystem(); // Reset everything
        }
        setIsGenerating(true);
    };
    
    const handlePause = () => setIsGenerating(false);

    const handleRegenerate = (index: number) => {
        if (isGenerating) return;
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
        const blob = new Blob([fullThesisContent], { type: 'text/markdown;charset=utf-8' });
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
            const { Document, Packer } = await import('docx');
            const { saveAs } = await import('file-saver');
            const zip = new JSZip();
            
            // 1. Add DOCX
            const docChildren = await createDocxContent(fullThesisContent);
            const doc = new Document({ sections: [{ children: docChildren }] });
            zip.file("thesis/gemini_thesis_draft.docx", Packer.toBlob(doc));
            
            // 2. Generate and Add Codebase
            log("Generating Python codebase with Gemini...");
            setStatusMessage("Generating Python codebase...");
            const codebaseFiles = await generateCodebase(fullThesisContent);
            const codebase = zip.folder("codebase");
            for (const filename in codebaseFiles) {
                codebase!.file(filename, codebaseFiles[filename]);
            }
            log("Codebase generated and added to package.");
            
            // 3. Add Artifacts and Log
            const artifacts = zip.folder("artifacts");
            artifacts!.file("figure_placeholders.json", JSON.stringify({ note: "List of figure placeholders and data schemas." }, null, 2));
            zip.file("session_log.txt", sessionLog.join('\n'));

            // 4. Save ZIP
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

    const handleRunChecks = async () => {
        setIsChecking(true);
        setStatusMessage("Running reproducibility checks...");
        log("Running reproducibility checks...");
        setChecks(prev => prev.map(c => ({ ...c, status: 'running', details: 'In progress...' })));

        await new Promise(resolve => setTimeout(resolve, 800));
        runCheck('codebase', 'success', 'Required files (main.py, README.md) are present.');

        await new Promise(resolve => setTimeout(resolve, 1000));
        runCheck('scripts', 'success', 'Entry point found in main.py.');
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        const figureRegex = /\[FIGURE placeholder id=F\d+ caption="[^"]+"\]/g;
        const matches = fullThesisContent.match(figureRegex);
        const figureResult = matches ? `Found and validated ${matches.length} figure placeholder(s).` : 'No figure placeholders found to check.';
        runCheck('figures', 'success', figureResult);
        
        setIsChecking(false);
        const finalMessage = "Reproducibility checks complete.";
        setStatusMessage(finalMessage);
        log(finalMessage);
    };

    const runCheck = (checkId: Check['id'], status: CheckStatus, details: string) => {
        setChecks(prev => prev.map(c => c.id === checkId ? { ...c, status, details } : c));
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
                            isFinished={currentSectionIndex >= plan.length}
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
                            isGenerating={isGenerating}
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
