
import React from 'react';

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomToFit: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onZoomToFit }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-md flex flex-col items-center gap-1">
            <button onClick={onZoomIn} className="p-2 rounded-md hover:bg-slate-200 transition-colors" title="Zoom In">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
            <button onClick={onZoomOut} className="p-2 rounded-md hover:bg-slate-200 transition-colors" title="Zoom Out">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                </svg>
            </button>
             <button onClick={onZoomToFit} className="p-2 rounded-md hover:bg-slate-200 transition-colors" title="Zoom to Fit">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
            </button>
        </div>
    );
};

export default ZoomControls;