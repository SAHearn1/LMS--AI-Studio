import React, { useState, useRef, useEffect } from 'react';
import { getAiAssistance } from '../services/geminiService';
import { useCanvasState } from '../hooks/useCanvasState';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AiAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! How can I help you explore your ideas on the canvas today?" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useThinkingMode, setUseThinkingMode] = useState(false);

    const nodes = useCanvasState((state) => state.nodes);
    const selectedNodeIds = useCanvasState((state) => state.selectedNodeIds);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newMessages: Message[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        const query = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getAiAssistance(nodes, selectedNodeIds, query, useThinkingMode);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-50 bg-brand-green text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                aria-label="Toggle AI Assistant"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" />
                </svg>
            </button>

            <div className={`fixed bottom-20 right-4 z-50 w-full max-w-sm bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} style={{height: '60vh'}}>
                <header className="p-4 border-b bg-slate-50 rounded-t-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">AI Learning Assistant</h2>
                        <p className="text-sm text-slate-500">Your partner in discovery</p>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-xs font-medium text-slate-600">Thinking Mode</span>
                        <input type="checkbox" className="toggle toggle-sm" checked={useThinkingMode} onChange={() => setUseThinkingMode(!useThinkingMode)} />
                        <div className={`relative inline-flex items-center h-4 rounded-full w-8 transition-colors ${useThinkingMode ? 'bg-brand-green' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${useThinkingMode ? 'translate-x-4' : 'translate-x-1'}`} />
                        </div>
                    </label>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="max-w-xs px-4 py-3 rounded-2xl bg-slate-200 text-slate-800">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-500 animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-50 rounded-b-xl">
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="w-full px-4 py-2 pr-12 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-10 text-blue-500 hover:text-blue-700 disabled:text-slate-400">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                           </svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AiAssistant;