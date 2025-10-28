import React, { useState } from 'react';
import { useCanvasState } from '../hooks/useCanvasState';
import { generateImage, generateVideo, editImage } from '../services/geminiService';
import { NodeType } from '../types';
import Modal from './common/Modal';

const AIGenerationModal: React.FC = () => {
    const modal = useCanvasState(state => state.modal);
    const closeModal = useCanvasState(state => state.closeModal);
    const addNode = useCanvasState(state => state.addNode);
    const updateNodeData = useCanvasState(state => state.updateNodeData);
    const [prompt, setPrompt] = useState(modal.type === 'IMAGE_EDIT' ? modal.data.node?.data?.prompt || '' : '');
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
    const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleImageGen = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setLoadingMessage('Generating your image with Imagen 4...');
        try {
            const base64Image = await generateImage(prompt, aspectRatio);
            addNode({
                type: NodeType.Image,
                position: modal.data.position || { x: 200, y: 200 },
                size: { width: 350, height: 350 },
                data: { src: `data:image/jpeg;base64,${base64Image}`, alt: prompt, prompt, base64: base64Image },
            });
            closeModal();
        } catch (error) { console.error(error); alert("Image generation failed."); }
        finally { setIsLoading(false); }
    };

    const handleVideoGen = async () => {
        if (!prompt && !modal.data.imageNode) return;
        setIsLoading(true);
        setLoadingMessage('Generating video with Veo 3... This may take a few minutes.');
        try {
            const videoUrl = await generateVideo(prompt, videoAspectRatio, modal.data.imageNode?.data);
            addNode({
                type: NodeType.Video,
                position: modal.data.position || { x: 200, y: 200 },
                size: { width: 480, height: 270 },
                data: { src: videoUrl, thumbnailSrc: '', prompt: prompt || `Animation of "${modal.data.imageNode.data.alt}"` },
            });
            closeModal();
        } catch (error) { console.error(error); alert("Video generation failed. You may need to select a project with billing enabled for Veo."); }
        finally { setIsLoading(false); }
    };

    const handleImageEdit = async () => {
        if (!prompt || !modal.data.node) return;
        setIsLoading(true);
        setLoadingMessage('Editing your image with Gemini...');
        try {
            const base64Image = await editImage(modal.data.node.data, prompt);
            updateNodeData(modal.data.node.id, {
                src: `data:image/jpeg;base64,${base64Image}`,
                base64: base64Image,
                alt: `${modal.data.node.data.alt} (edited: ${prompt})`,
                prompt: prompt,
            });
            closeModal();
        } catch (error) { console.error(error); alert("Image editing failed."); }
        finally { setIsLoading(false); }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-8"><p className="animate-pulse">{loadingMessage}</p></div>
        }
        
        switch (modal.type) {
            case 'IMAGE_GEN': return (
                <div className="space-y-4">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A vibrant coral reef teeming with bioluminescent fish..." className="w-full p-2 border rounded" rows={3}/>
                    <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="1:1">Square (1:1)</option>
                        <option value="16:9">Landscape (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                    </select>
                    <button onClick={handleImageGen} className="w-full bg-brand-green text-white p-2 rounded">Generate</button>
                </div>
            );
            case 'VIDEO_GEN': return (
                 <div className="space-y-4">
                    {modal.data.imageNode && <p className="text-sm text-slate-600">Animating image: "{modal.data.imageNode.data.alt}"</p>}
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A futuristic city with flying cars..." className="w-full p-2 border rounded" rows={3}/>
                    <select value={videoAspectRatio} onChange={e => setVideoAspectRatio(e.target.value as any)} className="w-full p-2 border rounded">
                        <option value="16:9">Landscape (16:9)</option>
                        <option value="9:16">Portrait (9:16)</option>
                    </select>
                    <p className="text-xs text-slate-500">Note: Video generation with Veo requires a project with billing enabled. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">Learn more</a></p>
                    <button onClick={handleVideoGen} className="w-full bg-brand-green text-white p-2 rounded">Generate Video</button>
                </div>
            );
            case 'IMAGE_EDIT': return (
                <div className="space-y-4">
                     <img src={modal.data.node.data.src} alt={modal.data.node.data.alt} className="rounded-lg max-h-48 mx-auto" />
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Add a party hat..." className="w-full p-2 border rounded" rows={2}/>
                    <button onClick={handleImageEdit} className="w-full bg-brand-green text-white p-2 rounded">Apply Edit</button>
                </div>
            );
            default: return null;
        }
    };
    
    const titles = {
        'IMAGE_GEN': 'Generate AI Image',
        'VIDEO_GEN': 'Generate AI Video',
        'IMAGE_EDIT': 'Edit Image with AI',
    };

    if (!modal.type || !titles[modal.type]) return null;

    return <Modal title={titles[modal.type]} onClose={isLoading ? () => {} : closeModal}>{renderContent()}</Modal>
};

export default AIGenerationModal;