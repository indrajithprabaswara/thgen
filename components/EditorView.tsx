import React, { useRef, useEffect } from 'react';

interface EditorViewProps {
    content: string;
}

const SimpleMarkdownRenderer: React.FC<{ source: string }> = ({ source }) => {
    if (!source) return null;

    const blocks = source.split(/\n\n+/);

    return (
        <>
            {blocks.map((block, index) => {
                const headerMatch = block.match(/^(#+)\s+(.*)/);
                if (headerMatch) {
                    const level = headerMatch[1].length;
                    const text = headerMatch[2];
                    // Fix: The original dynamic tag <Tag> caused JSX namespace and typing errors.
                    // Replaced with React.createElement for robust dynamic tag rendering.
                    const tag = `h${level > 6 ? 6 : level}`;
                    return React.createElement(tag, { key: index, className: "font-bold serif" }, text);
                }
                
                // Handle simple paragraphs with line breaks within them
                return (
                    <p key={index}>
                        {block.split('\n').map((line, lineIndex, arr) => (
                            <React.Fragment key={lineIndex}>
                                {line}
                                {lineIndex < arr.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </>
    );
};


const EditorView: React.FC<EditorViewProps> = ({ content }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.scrollTop = editorRef.current.scrollHeight;
        }
    }, [content]);

    return (
        <div ref={editorRef} className="flex-grow p-6 overflow-y-auto bg-gray-900">
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 serif">
                <SimpleMarkdownRenderer source={content} />
            </div>
        </div>
    );
};

export default EditorView;