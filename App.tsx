import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import AiAssistant from './components/AiAssistant';
import ZoomControls from './components/ZoomControls';
import AIGenerationModal from './components/AIGenerationModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import { useCanvasState } from './hooks/useCanvasState';

const App: React.FC = () => {
  const zoomIn = useCanvasState(state => state.zoomIn);
  const zoomOut = useCanvasState(state => state.zoomOut);
  const zoomToFit = useCanvasState(state => state.zoomToFit);
  const modal = useCanvasState(state => state.modal);
  
  return (
    <div className="w-screen h-screen font-sans antialiased relative overflow-hidden">
      <header className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-brand-green">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.566-.283-1.133-.283-1.7 0M11.35 20.164c-.566.283-1.133.283-1.7 0m6.928-15.14a8.967 8.967 0 0 0-1.708-1.118m-3.512 0a8.967 8.967 0 0 0-1.708 1.118m9.055 12.022a8.967 8.967 0 0 0 1.708 1.118m-3.512 0a8.967 8.967 0 0 0 1.708-1.118M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 5.46-1.855m-10.92 0A8.949 8.949 0 0 0 12 21Zm0-18a8.949 8.949 0 0 0-5.46 1.855m10.92 0A8.949 8.949 0 0 0 12 3Z" />
        </svg>

        <div>
          <h1 className="text-lg font-bold text-slate-800">RootWork Canvas</h1>
          <p className="text-xs text-slate-500">Visual Learning Ecosystem</p>
        </div>
      </header>
      
      <Canvas />
      <Toolbar />
      <AiAssistant />
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onZoomToFit={zoomToFit} />
      {modal.type && (modal.type === 'IMAGE_GEN' || modal.type === 'VIDEO_GEN' || modal.type === 'IMAGE_EDIT') && <AIGenerationModal />}
      {modal.type === 'VIDEO_PLAYER' && <VideoPlayerModal src={modal.data.src} />}
    </div>
  );
};

export default App;
