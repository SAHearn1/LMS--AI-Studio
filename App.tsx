import React from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import AiAssistant from './components/AiAssistant';
import ZoomControls from './components/ZoomControls';
import AIGenerationModal from './components/AIGenerationModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import LessonLoaderModal from './components/LessonLoaderModal';
import LessonPlanPanel from './components/LessonPlanPanel';
import { useCanvasState } from './hooks/useCanvasState';

const App: React.FC = () => {
  const { zoomIn, zoomOut, zoomToFit, modal, lessonPlan, toggleLessonPanel } = useCanvasState(state => ({
    zoomIn: state.zoomIn,
    zoomOut: state.zoomOut,
    zoomToFit: state.zoomToFit,
    modal: state.modal,
    lessonPlan: state.lessonPlan,
    toggleLessonPanel: state.toggleLessonPanel,
  }));

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
      
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onZoomToFit={zoomToFit} />
        {lessonPlan && (
           <div className="bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-md flex flex-col items-center gap-1">
             <button onClick={toggleLessonPanel} className="p-2 rounded-md hover:bg-slate-200 transition-colors" title="Show/Hide Lesson Plan">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-8.994v6.494c0 .566.474 1.022 1.055.998a8.043 8.043 0 014.288-1.996 8.043 8.043 0 014.288 1.996 1.04 1.04 0 001.055-.998V8.753c0-.566-.474-1.022-1.055-.998a8.043 8.043 0 01-4.288 1.996 8.043 8.043 0 01-4.288-1.996A1.04 1.04 0 003 8.753z" />
                </svg>
            </button>
           </div>
        )}
      </div>

      <Canvas />
      <Toolbar />
      <AiAssistant />
      <LessonPlanPanel />

      {modal.type && (modal.type === 'IMAGE_GEN' || modal.type === 'VIDEO_GEN' || modal.type === 'IMAGE_EDIT') && <AIGenerationModal />}
      {modal.type === 'VIDEO_PLAYER' && <VideoPlayerModal src={modal.data.src} />}
      {modal.type === 'LESSON_LOADER' && <LessonLoaderModal />}

    </div>
  );
};

export default App;