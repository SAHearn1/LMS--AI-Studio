import React from 'react';
import { useCanvasState } from '../hooks/useCanvasState';

interface VideoPlayerModalProps {
    src: string;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ src }) => {
    const closeModal = useCanvasState(state => state.closeModal);
    
    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeModal}>
            <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <button onClick={closeModal} className="absolute -top-10 right-0 text-white text-3xl font-bold">&times;</button>
                <video src={src} controls autoPlay className="w-full h-auto rounded-lg" />
            </div>
        </div>
    );
};

export default VideoPlayerModal;
