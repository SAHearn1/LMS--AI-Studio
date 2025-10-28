import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import type { TextNode as TextNodeType } from '../types';
import { useCanvasState } from '../hooks/useCanvasState';

interface TextEditorProps {
    node: TextNodeType;
}

const TextEditor: React.FC<TextEditorProps> = ({ node }) => {
    const updateNodeData = useCanvasState(state => state.updateNodeData);
    const setEditingNodeId = useCanvasState(state => state.setEditingNodeId);
    const stage = useCanvasState(state => state.stage);
    const [value, setValue] = useState(node.data.text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, []);

    const handleBlur = () => {
        updateNodeData<TextNodeType['data']>(node.id, { text: value });
        setEditingNodeId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape' || (e.key === 'Enter' && !e.shiftKey)) {
            e.preventDefault();
            handleBlur();
        }
    };
    
    if (!stage) return null;
    
    const textNodePosition = { x: node.position.x, y: node.position.y };
    const stageScale = stage.scaleX();
    const stagePos = stage.position();

    const absolutePos = {
        x: textNodePosition.x * stageScale + stagePos.x,
        y: textNodePosition.y * stageScale + stagePos.y,
    };
    
    const style: React.CSSProperties = {
        position: 'absolute',
        top: `${absolutePos.y}px`,
        left: `${absolutePos.x}px`,
        width: `${node.size.width * stageScale}px`,
        height: `${node.size.height * stageScale}px`,
        fontSize: `${16 * stageScale}px`,
        lineHeight: 1.5,
        padding: `${16 * stageScale}px`,
        margin: 0,
        border: '1px solid #2563EB',
        outline: 'none',
        resize: 'none',
        background: node.data.backgroundColor,
        color: '#1f2937',
        fontFamily: 'Inter, sans-serif',
        zIndex: 100,
        borderRadius: `${8 * stageScale}px`,
        boxSizing: 'border-box',
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={style}
        />
    );
};

export default TextEditor;