
import React from 'react';
import { PlayIcon, PauseIcon, ArrowDownTrayIcon, ArrowPathIcon, DocumentTextIcon, ArchiveBoxIcon, ListBulletIcon } from '@heroicons/react/24/solid';

interface ControlPanelProps {
    isGenerating: boolean;
    onStart: () => void;
    onPause: () => void;
    onExportMd: () => void;
    onExportDocx: () => void;
    onExportZip: () => void;
    onExportLog: () => void;
    isFinished: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
    isGenerating, 
    onStart, 
    onPause, 
    onExportMd, 
    onExportDocx, 
    onExportZip, 
    onExportLog,
    isFinished 
}) => {
    const buttonBaseClasses = "w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {!isGenerating ? (
                 <button 
                    onClick={onStart}
                    className={`${buttonBaseClasses} bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-500`}
                >
                    {isFinished ? <ArrowPathIcon className="h-5 w-5"/> : <PlayIcon className="h-5 w-5"/>}
                    {isFinished ? 'Start Over' : 'Start'}
                </button>
            ) : (
                <button 
                    onClick={onPause}
                    className={`${buttonBaseClasses} bg-amber-600 hover:bg-amber-500 focus:ring-amber-500`}
                >
                    <PauseIcon className="h-5 w-5"/>
                    Pause
                </button>
            )}

            <button 
                onClick={onExportMd}
                disabled={isGenerating}
                className={`${buttonBaseClasses} bg-gray-600 hover:bg-gray-500 focus:ring-gray-500`}
            >
                <ArrowDownTrayIcon className="h-5 w-5"/>
                Export .md
            </button>

            <button 
                onClick={onExportDocx}
                disabled={isGenerating}
                className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-500 focus:ring-blue-500`}
            >
                <DocumentTextIcon className="h-5 w-5"/>
                Export .docx
            </button>
            
            <button 
                onClick={onExportZip}
                disabled={isGenerating}
                className={`${buttonBaseClasses} bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500`}
            >
                <ArchiveBoxIcon className="h-5 w-5"/>
                Export .zip
            </button>
            
            <button 
                onClick={onExportLog}
                className={`${buttonBaseClasses} bg-teal-600 hover:bg-teal-500 focus:ring-teal-500 col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2`}
            >
                <ListBulletIcon className="h-5 w-5"/>
                Download Log
            </button>
        </div>
    );
};

export default ControlPanel;
