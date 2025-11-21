"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Mic, Settings, User, Menu, Plus } from 'lucide-react';
import ReactMarkdown from "react-markdown";

// Sidebar Component
const Sidebar = ({ isOpen, onClose, currentPage, onNavigate, onNewChat }) => {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-16 flex flex-col items-center py-4
      `}>
                <div className="mb-8 w-10 h-10 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SK</span>
                    </div>
                </div>

                <nav className="flex-1 flex flex-col gap-2 w-full px-2">
                    <button
                        onClick={() => onNavigate('/')}
                        className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all
              ${currentPage === '/'
                                ? 'bg-gray-100 text-black'
                                : 'text-gray-600 hover:text-black hover:bg-gray-50'
                            }
            `}
                        title="Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => onNavigate('/voice')}
                        className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all
              ${currentPage === '/voice'
                                ? 'bg-gray-100 text-black'
                                : 'text-gray-600 hover:text-black hover:bg-gray-50'
                            }
            `}
                        title="Voice"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                </nav>

                <button
                    onClick={onNewChat}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-all mb-2"
                    title="New Chat"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </aside>
        </>
    );
};

// Navbar Component
const Navbar = ({ onMenuClick }) => {
    return (
        <nav className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
            <button
                onClick={onMenuClick}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:block">
                <h1 className="text-black font-medium text-sm">SK Voice Assistant</h1>
            </div>

            <div className="lg:hidden flex-1 text-center">
                <h1 className="text-black font-medium text-sm">SK Voice Assistant</h1>
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
                    title="Settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
                    title="Profile"
                >
                    <User className="w-4 h-4" />
                </button>
            </div>
        </nav>
    );
};

// Wave Animation Component
const WaveAnimation = ({ state }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {(state === "recording" || state === "speaking") && (
                <>
                    <div className={`absolute w-64 h-64 rounded-full ${state === "recording" ? "bg-blue-500/10" : "bg-green-500/10"
                        } animate-ping`} style={{ animationDuration: '2s' }}></div>
                    <div className={`absolute w-48 h-48 rounded-full ${state === "recording" ? "bg-blue-500/20" : "bg-green-500/20"
                        } animate-ping`} style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}></div>
                    <div className={`absolute w-32 h-32 rounded-full ${state === "recording" ? "bg-blue-500/30" : "bg-green-500/30"
                        } animate-ping`} style={{ animationDuration: '1s', animationDelay: '0.6s' }}></div>
                </>
            )}
        </div>
    );
};

// Circular Wave Bars for Speaking
const CircularWaveBars = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1 items-end h-8">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1 bg-green-500 rounded-full animate-wave"
                        style={{
                            animationDelay: `${i * 0.1}s`,
                            height: '100%'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

// Voice Recorder Button
function VoiceRecorder({ onResult, sessionId, setSessionId, setState, state }) {
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: "audio/mpeg" });
                sendToBackend(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.current.start();
            setState("recording");
        } catch (err) {
            console.error("Microphone access denied:", err);
            setState("error");
            setTimeout(() => setState("idle"), 2000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
            setState("processing");
        }
    };

    const sendToBackend = async (blob) => {
        const formData = new FormData();
        const file = new File([blob], "voice.mp3", { type: "audio/mpeg" });

        formData.append("file", file);
        if (sessionId) formData.append("session_id", sessionId);

        try {
            const res = await fetch("http://localhost:8000/voice/main", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.session_id) {
                setSessionId(data.session_id);
            }

            onResult(data);

            if (data.audio_base64) {
                setState("speaking");
                const bytes = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));
                const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
                const url = URL.createObjectURL(audioBlob);

                if (audioRef.current) {
                    audioRef.current.pause();
                }

                audioRef.current = new Audio(url);
                audioRef.current.play();
                audioRef.current.onended = () => setState("idle");
            } else {
                setState("idle");
            }
        } catch (err) {
            console.error("Backend error:", err);
            setState("error");
            setTimeout(() => setState("idle"), 2000);
        }
    };

    const handleClick = () => {
        if (state === "recording") {
            stopRecording();
        } else if (state === "idle") {
            startRecording();
        }
    };

    return (
        <div className="relative">
            <WaveAnimation state={state} />

            <button
                onClick={handleClick}
                disabled={state === "processing" || state === "speaking"}
                className={`relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${state === "recording"
                        ? "bg-blue-500 scale-105"
                        : state === "processing"
                            ? "bg-purple-500 scale-100"
                            : state === "speaking"
                                ? "bg-green-500 scale-105"
                                : state === "error"
                                    ? "bg-red-500 scale-95"
                                    : "bg-blue-500 hover:scale-110 active:scale-95"
                    } disabled:opacity-60`}
            >
                {state === "recording" ? (
                    <div className="w-12 h-12 bg-white rounded-lg animate-pulse"></div>
                ) : state === "processing" ? (
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : state === "speaking" ? (
                    <CircularWaveBars />
                ) : state === "error" ? (
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <Mic className="w-16 h-16 md:w-20 md:h-20 text-white" />
                )}
            </button>
        </div>
    );
}

// Status Text
function StatusText({ state }) {
    const messages = {
        idle: "Tap to speak",
        recording: "Listening...",
        processing: "Processing...",
        speaking: "Speaking...",
        error: "Error occurred"
    };

    return (
        <div className="text-center mt-8">
            <p className={`text-lg font-medium transition-colors ${state === "recording" ? "text-blue-600" :
                    state === "processing" ? "text-purple-600" :
                        state === "speaking" ? "text-green-600" :
                            state === "error" ? "text-red-600" :
                                "text-gray-600"
                }`}>
                {messages[state]}
            </p>
        </div>
    );
}

// Conversation Display
// function ConversationDisplay({ userText, aiText, isVisible }) {
//     if (!isVisible || (!userText && !aiText)) return null;

//     return (
//         <div className="w-full max-w-2xl mx-auto px-4 space-y-4">
//             {userText && (
//                 <div className="flex justify-end animate-slideIn">
//                     <div className="bg-blue-500 text-white rounded-3xl px-6 py-3 max-w-md shadow-lg">
//                         <p className="text-sm leading-relaxed">{userText}</p>
//                     </div>
//                 </div>
//             )}

//             {aiText && (
//                 <div className="flex justify-start animate-slideIn">
//                     <div className="bg-gray-100 text-gray-900 rounded-3xl px-6 py-3 max-w-md shadow-lg">
//                         <div className="prose prose-sm max-w-none">
//                             <ReactMarkdown>
//                                 {aiText}
//                             </ReactMarkdown>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// Main Component
export default function VoicePage() {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [state, setState] = useState("idle");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage] = useState('/voice');
    const [currentUserText, setCurrentUserText] = useState("");
    const [currentAiText, setCurrentAiText] = useState("");
    const [showConversation, setShowConversation] = useState(false);

    const handleResult = (data) => {
        setMessages((prev) => [
            ...prev,
            { text: data.text, sender: "user" },
            { text: data.reply, sender: "ai" },
        ]);

        setCurrentUserText(data.text);
        setCurrentAiText(data.reply);
        setShowConversation(true);

        setTimeout(() => {
            setShowConversation(false);
            setCurrentUserText("");
            setCurrentAiText("");
        }, 8000);
    };

    const handleNavigate = (page) => {
        setSidebarOpen(false);
        if (page === '/') {
            window.location.href = '/';
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSessionId(null);
        setState("idle");
        setCurrentUserText("");
        setCurrentAiText("");
        setShowConversation(false);
        setSidebarOpen(false);
    };

    return (
        <>
            <style jsx global>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>

            <div className="flex h-screen bg-white overflow-hidden">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onNewChat={handleNewChat}
                />

                <div className="flex-1 flex flex-col lg:ml-16">
                    <Navbar onMenuClick={() => setSidebarOpen(true)} />

                    <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                        {/* Top Section - Conversation Display */}
                        {/* <div className="absolute top-8 left-0 right-0 z-10">
                            <ConversationDisplay
                                userText={currentUserText}
                                aiText={currentAiText}
                                isVisible={showConversation}
                            />
                        </div> */}

                        {/* Center Section - Voice Button */}
                        <div className="flex flex-col items-center justify-center">
                            <VoiceRecorder
                                onResult={handleResult}
                                sessionId={sessionId}
                                setSessionId={setSessionId}
                                setState={setState}
                                state={state}
                            />
                            <StatusText state={state} />
                        </div>

                        {/* Session ID Badge */}
                        {sessionId && (
                            <div className="absolute bottom-8 right-8 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 shadow-sm">
                                <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Session: {sessionId.slice(0, 8)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}