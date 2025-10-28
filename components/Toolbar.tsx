import React from 'react';
import { useCanvasState } from '../hooks/useCanvasState';
import { NodeType, TextNodeData } from '../types';
import type { Stage } from 'konva/lib/Stage';
import { fileToBase64, triggerFileUpload } from '../utils/helpers';

const Toolbar: React.FC = () => {
    const addNode = useCanvasState(state => state.addNode);
    const stage = useCanvasState(state => state.stage);
    const openModal = useCanvasState(state => state.openModal);

    const getNodePosition = () => {
        if (!stage) return { x: 200, y: 200};
        const currentPos = stage.getPointerPosition() || {x: stage.width()/2, y: stage.height()/2};
        
        return {
            x: (currentPos.x - stage.x()) / stage.scaleX(),
            y: (currentPos.y - stage.y()) / stage.scaleY(),
        };
    };

    const handleAddNote = () => {
        addNode({
            type: NodeType.Text,
            position: getNodePosition(),
            size: { width: 250, height: 100 },
            data: { text: 'New Note', backgroundColor: '#BFDBFE' }
        });
    };

    const handleImageUpload = () => {
        triggerFileUpload('image/jpeg,image/png', async (file) => {
            const base64 = await fileToBase64(file);
            const src = URL.createObjectURL(file);
            addNode({
                type: NodeType.Image,
                position: getNodePosition(),
                size: { width: 300, height: 200 },
                data: { src, alt: file.name, base64 }
            });
        });
    }

    const tools = [
        { label: 'Lesson', icon: 'M12 6.253v11.494m-9-8.994v6.494c0 .566.474 1.022 1.055.998a8.043 8.043 0 014.288-1.996 8.043 8.043 0 014.288 1.996 1.04 1.04 0 001.055-.998V8.753c0-.566-.474-1.022-1.055-.998a8.043 8.043 0 01-4.288 1.996 8.043 8.043 0 01-4.288-1.996A1.04 1.04 0 003 8.753z', action: () => openModal('LESSON_LOADER')},
        { label: 'Note', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', action: handleAddNote },
        { label: 'Image', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', action: handleImageUpload },
        { label: 'AI Image', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l-3 3m14 10l-3 3M19 6l-3 3M5 19l3-3', action: () => openModal('IMAGE_GEN', { position: getNodePosition() })},
        { label: 'AI Video', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', action: () => openModal('VIDEO_GEN', { position: getNodePosition() })},
    ];

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg flex items-center gap-2">
            {tools.map(tool => (
                <button
                    key={tool.label}
                    onClick={tool.action}
                    className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-slate-200 transition-colors w-20 h-16"
                    title={tool.label}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                    </svg>
                    <span className="text-xs text-slate-600 mt-1">{tool.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Toolbar;