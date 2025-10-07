import React, { useRef, useEffect } from 'react';

interface EditorViewProps {
    content: string;
}

const SimpleMarkdownRenderer: React.FC<{ source: string }> = ({ source }) => {
    if (!source) return null;

    const blocks = source.split(/\n\n+/);
    const renderedBlocks = [];
    let inList = false;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const isListBlock = block.split('\n').every(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));

        if (isListBlock) {
            if (!inList) {
                inList = true;
                const listItems = block.split('\n').map((item, itemIndex) => (
                    <li key={itemIndex}>{item.substring(2)}</li>
                ));
                renderedBlocks.push(<ul key={`ul-${i}`} className="list-disc pl-5 space-y-1">{listItems}</ul>);
            } else {
                 // Continue existing list
                const lastElement = renderedBlocks[renderedBlocks.length - 1];
                if (lastElement.type === 'ul') {
                    const newItems = block.split('\n').map((item, itemIndex) => (
                         <li key={`${i}-${itemIndex}`}>{item.substring(2)}</li>
                    ));
                    lastElement.props.children.push(...newItems);
                }
            }
        } else {
            inList = false;
            const headerMatch = block.match(/^(#+)\s+(.*)/);
            if (headerMatch) {
                const level = headerMatch[1].length;
                const text = headerMatch[2];
                const tag = `h${level > 6 ? 6 : level}`;
                renderedBlocks.push(React.createElement(tag, { key: i, className: "font-bold serif" }, text));
            } else {
                renderedBlocks.push(
                    <p key={i}>
                        {block.split('\n').map((line, lineIndex, arr) => (
                            <React.Fragment key={lineIndex}>
                                {line}
                                {lineIndex < arr.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                );
            }
        }
    }

    return <>{renderedBlocks}</>;
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