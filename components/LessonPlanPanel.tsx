import React from 'react';
import { useCanvasState } from '../hooks/useCanvasState';

const LessonPlanPanel: React.FC = () => {
    const { lessonPlan, isLessonPanelOpen, toggleTaskCompletion, toggleLessonPanel } = useCanvasState(state => ({
        lessonPlan: state.lessonPlan,
        isLessonPanelOpen: state.isLessonPanelOpen,
        toggleTaskCompletion: state.toggleTaskCompletion,
        toggleLessonPanel: state.toggleLessonPanel,
    }));

    if (!lessonPlan || !isLessonPanelOpen) {
        return null;
    }

    const completedTasks = lessonPlan.tasks.filter(t => t.completed).length;
    const totalTasks = lessonPlan.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="absolute top-40 right-4 z-10 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out">
            <header className="p-4 border-b rounded-t-xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-bold text-slate-800">{lessonPlan.title}</h2>
                    <button onClick={toggleLessonPanel} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
                </div>
                <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div className="bg-brand-green h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </header>
            <div className="flex-1 p-4 overflow-y-auto max-h-96">
                <ul className="space-y-3">
                    {lessonPlan.tasks.map((task, index) => (
                        <li key={index} className="flex items-start gap-3">
                           <input 
                            type="checkbox"
                            id={`task-${index}`}
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(index)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                            />
                            <label htmlFor={`task-${index}`} className={`text-sm text-slate-700 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                                {task.text}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LessonPlanPanel;