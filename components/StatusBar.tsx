
import React from 'react';

interface StatusBarProps {
    message: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ message }) => {
    return (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg shadow-inner text-center">
            <p className="text-sm truncate">{message}</p>
        </div>
    );
};

export default StatusBar;
