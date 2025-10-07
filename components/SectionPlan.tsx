import React, { useRef, useEffect } from 'react';
import { PlanSection } from '../types';
import { ArrowPathIcon, FlagIcon, CheckCircleIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { FlagIcon as FlagIconOutline } from '@heroicons/react/24/outline';


interface SectionPlanProps {
    plan: PlanSection[];
    currentSectionIndex: number;
    onRegenerate: (index: number) => void;
    onFlag: (index: number) => void;
    isGenerating: boolean;
}

const SectionPlan: React.FC<SectionPlanProps> = ({ plan, currentSectionIndex, onRegenerate, onFlag, isGenerating }) => {
    const currentSectionRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (currentSectionRef.current) {
            currentSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [currentSectionIndex]);

    const totalPlanWords = plan.reduce((sum, section) => sum + section.targetWordCount, 0);

    return (
        <>
            <div className="overflow-y-auto flex-grow pr-2 -mr-2">
                <ul className="space-y-1">
                    {plan.map((section, index) => {
                        const isCurrent = index === currentSectionIndex && !isGenerating;
                        const isProcessing = index === currentSectionIndex && isGenerating;
                        const isCompleted = index < currentSectionIndex;
                        
                        let itemClasses = "rounded-md transition-all duration-200 text-sm flex flex-col";
                        if (isCurrent) {
                            itemClasses += " bg-cyan-900/50 ring-1 ring-cyan-500";
                        } else if (isProcessing) {
                             itemClasses += " bg-cyan-900/80 ring-1 ring-cyan-400 animate-pulse";
                        } else if (isCompleted) {
                            itemClasses += " bg-gray-700/50 text-gray-400";
                        } else {
                            itemClasses += " bg-gray-800";
                        }
                        
                        // Sections with originalWordCount of 0 are structural headers (e.g., Chapter titles)
                        const isStructuralHeader = section.originalWordCount === 0 && section.level === 1;

                        return (
                            <li 
                                key={`${section.id}-${index}`}
                                ref={isCurrent || isProcessing ? currentSectionRef : null}
                                className={itemClasses}
                            >
                                <div 
                                    className="flex justify-between items-start p-2"
                                    style={{ paddingLeft: `${0.5 + (section.level > 1 ? section.level - 1 : 0) * 1.25}rem`}}
                                >
                                    <div className="flex-1 overflow-hidden">
                                        <span className={`font-medium truncate ${isStructuralHeader ? 'font-bold text-white' : ''} ${isCompleted ? 'line-through' : ''}`}>
                                            {isCompleted && <CheckCircleIcon className="h-4 w-4 inline-block mr-1.5 text-green-400" />}
                                            {isStructuralHeader && <BookOpenIcon className="h-4 w-4 inline-block mr-1.5 text-gray-400"/>}
                                            {section.title}
                                        </span>
                                        { section.targetWordCount > 0 && 
                                            <div className="text-xs text-gray-400">
                                                Target: {section.targetWordCount.toLocaleString()} words
                                            </div>
                                        }
                                    </div>
                                    <div className="flex items-center space-x-2 pl-2">
                                        <button
                                            onClick={() => onFlag(index)}
                                            title={section.isFlagged ? "Unflag section" : "Flag for review"}
                                            className="text-gray-400 hover:text-amber-400 disabled:opacity-50"
                                            disabled={isGenerating}
                                        >
                                            {section.isFlagged ? <FlagIcon className="h-5 w-5 text-amber-500"/> : <FlagIconOutline className="h-5 w-5"/>}
                                        </button>
                                        <button
                                            onClick={() => onRegenerate(index)}
                                            title="Regenerate this section"
                                            className="text-gray-400 hover:text-cyan-400 disabled:opacity-50"
                                            disabled={isGenerating}
                                        >
                                            <ArrowPathIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700 text-right">
                <p className="text-sm font-bold text-gray-300">
                    Total Planned Words: {' '}
                    <span className="text-cyan-400">{totalPlanWords.toLocaleString()} / 90,000</span>
                </p>
            </div>
        </>
    );
};

export default SectionPlan;
