import React from 'react';
import { useCanvasState } from '../hooks/useCanvasState';
import Modal from './common/Modal';

const assignedLessons = [
    {
        title: "Explore the Solar System",
        tasks: [
            "Create a text note for each planet: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
            "Use the AI Image tool to generate a picture of the Sun and place it in the center.",
            "Find a cool fact about Jupiter's Great Red Spot and add it to a note.",
            "Arrange the planet notes in order from the Sun.",
            "Generate an AI image of a 'friendly robot on Mars' and place it near the Mars note.",
        ]
    },
    {
        title: "The Journey of Water",
        tasks: [
            "Create four text notes with the titles: Evaporation, Condensation, Precipitation, Collection.",
            "Generate an AI image for 'sunshine on the ocean' and place it near Evaporation.",
            "Generate an AI image for 'fluffy white clouds in the sky' and place it near Condensation.",
            "Generate an AI image for 'gentle rain falling on hills' and place it near Precipitation.",
            "Arrange your notes and images to show how the water cycle works.",
        ]
    }
];


const LessonLoaderModal: React.FC = () => {
    const { closeModal, setLessonPlan } = useCanvasState(state => ({ closeModal: state.closeModal, setLessonPlan: state.setLessonPlan }));

    const handleSelectLesson = (lesson: { title: string; tasks: string[] }) => {
        setLessonPlan(lesson);
        closeModal();
    }

    return (
        <Modal title="Your Assigned Lessons" onClose={closeModal}>
            <div className="space-y-4">
                <div>
                    <h3 className="text-md font-semibold text-slate-700 mb-2">Select a lesson to begin:</h3>
                    <div className="space-y-2">
                        {assignedLessons.map(lesson => (
                            <button key={lesson.title} onClick={() => handleSelectLesson(lesson)} className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                                <span className="font-medium text-slate-800">{lesson.title}</span>
                                <p className="text-xs text-slate-500 mt-1">{lesson.tasks.length} tasks</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LessonLoaderModal;
