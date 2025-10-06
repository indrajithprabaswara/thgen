
import React from 'react';

interface DashboardProps {
    currentWordCount: number;
    globalTargetWordCount: number;
    sectionsCompleted: number;
    totalSections: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    currentWordCount, 
    globalTargetWordCount, 
    sectionsCompleted, 
    totalSections 
}) => {
    const overallProgress = globalTargetWordCount > 0 ? (currentWordCount / globalTargetWordCount) * 100 : 0;
    const sectionProgress = totalSections > 0 ? (sectionsCompleted / totalSections) * 100 : 0;

    return (
        <div className="space-y-5">
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-300">Overall Word Count</span>
                    <span className="text-sm font-bold text-cyan-400">{currentWordCount.toLocaleString()} / {globalTargetWordCount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
                </div>
            </div>
            <div>
                 <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-300">Sections Completed</span>
                    <span className="text-sm font-bold text-amber-400">{sectionsCompleted} / {totalSections}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${sectionProgress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
