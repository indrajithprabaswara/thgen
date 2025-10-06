import React from 'react';
import { PlanSection } from '../types';
import { ArrowUpRightIcon } from '@heroicons/react/24/solid';

interface ExpansionPlanProps {
    plan: PlanSection[];
}

const ExpansionPlan: React.FC<ExpansionPlanProps> = ({ plan }) => {
    const expandedSections = plan.filter(s => s.expansionJustification);

    if (expandedSections.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800/50 p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Planned Expansions</h2>
            <div className="space-y-3 text-sm max-h-40 overflow-y-auto pr-2">
                {expandedSections.map(section => (
                    <div key={section.id} className="p-2 bg-gray-700/50 rounded-md">
                        <div className="font-medium text-gray-300 flex justify-between">
                            <span>{section.title}</span>
                             <span className="font-bold text-green-400 flex items-center">
                                <ArrowUpRightIcon className="h-4 w-4 mr-1"/>
                                +{(section.targetWordCount - (section.originalWordCount || 0)).toLocaleString()}
                             </span>
                        </div>
                        <p className="text-xs text-gray-400 italic mt-1">{section.expansionJustification}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpansionPlan;
