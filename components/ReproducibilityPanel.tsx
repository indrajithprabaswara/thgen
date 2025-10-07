
import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { Check } from '../types';

interface ReproducibilityPanelProps {
    checks: Check[];
    isChecking: boolean;
    onRunChecks: () => void;
}

const StatusIcon: React.FC<{ status: Check['status'] }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <ArrowPathIcon className="h-5 w-5 text-cyan-400 animate-spin" />;
        case 'success':
            return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'failure':
            return <XCircleIcon className="h-5 w-5 text-red-400" />;
        case 'pending':
        default:
            return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
};

const ReproducibilityPanel: React.FC<ReproducibilityPanelProps> = ({ checks, isChecking, onRunChecks }) => {
    
    const getStatusTextColor = (status: Check['status']) => {
        switch (status) {
            case 'running': return 'text-cyan-400';
            case 'success': return 'text-gray-300';
            case 'failure': return 'text-red-400';
            case 'pending':
            default: return 'text-gray-400';
        }
    }
    
    return (
        <div className="bg-gray-800/50 p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Reproducibility Checks</h2>
            <div className="space-y-4 text-sm">
                {checks.map(check => (
                     <div key={check.id} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                             <StatusIcon status={check.status} />
                        </div>
                        <div className="ml-3">
                            <p className={`font-medium ${getStatusTextColor(check.status)}`}>{check.label}</p>
                            <p className="text-xs text-gray-500">{check.details}</p>
                        </div>
                    </div>
                ))}

                 <button 
                    onClick={onRunChecks}
                    disabled={isChecking}
                    className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isChecking ? 'Running Checks...' : 'Run Checks'}
                </button>
            </div>
        </div>
    );
};

export default ReproducibilityPanel;
