"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Mic, Settings, User, Menu, Plus } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import Image from "next/image";

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
                    <div className="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center">
                        <Image src="/images/artificial-intelligence.png" width={32} height={32} alt="LOS AI Logo" />
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
        <nav className="h-14 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
            <button
                onClick={onMenuClick}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:block">
                <h1 className="text-black font-medium text-sm">LOS AI Voice</h1>
            </div>

            <div className="lg:hidden flex-1 text-center">
                <h1 className="text-black font-medium text-sm">LOS AI Voice</h1>
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
                    <div className={`absolute w-96 h-96 rounded-full ${state === "recording" ? "bg-blue-500/5" : "bg-green-500/5"
                        } animate-ping`} style={{ animationDuration: '3s' }}></div>
                    <div className={`absolute w-72 h-72 rounded-full ${state === "recording" ? "bg-blue-500/10" : "bg-green-500/10"
                        } animate-ping`} style={{ animationDuration: '2.5s', animationDelay: '0.2s' }}></div>
                    <div className={`absolute w-48 h-48 rounded-full ${state === "recording" ? "bg-blue-500/20" : "bg-green-500/20"
                        } animate-ping`} style={{ animationDuration: '2s', animationDelay: '0.4s' }}></div>
                </>
            )}
        </div>
    );
};

// Circular Wave Bars for Speaking
const CircularWaveBars = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1.5 items-center h-12">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1.5 bg-white rounded-full animate-wave shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{
                            animationDelay: `${i * 0.1}s`,
                            height: '40%'
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
        <div className="relative group">
            <WaveAnimation state={state} />

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${state === "recording" ? "bg-blue-500/40 scale-125" :
                state === "processing" ? "bg-purple-500/40 scale-110" :
                    state === "speaking" ? "bg-green-500/40 scale-125" :
                        "bg-gray-200/0 scale-100 group-hover:bg-blue-500/20 group-hover:scale-110"
                }`}></div>

            <button
                onClick={handleClick}
                disabled={state === "processing" || state === "speaking"}
                className={`relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border-4 ${state === "recording"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-300 scale-110"
                    : state === "processing"
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-300 scale-100"
                        : state === "speaking"
                            ? "bg-gradient-to-br from-green-500 to-green-600 border-green-300 scale-110"
                            : state === "error"
                                ? "bg-gradient-to-br from-red-500 to-red-600 border-red-300 scale-95"
                                : "bg-white border-gray-100 hover:border-blue-200 hover:scale-105"
                    } disabled:cursor-not-allowed`}
            >
                {state === "recording" ? (
                    <div className="w-12 h-12 bg-white rounded-xl animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                ) : state === "processing" ? (
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : state === "speaking" ? (
                    <CircularWaveBars />
                ) : state === "error" ? (
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <Mic className="w-16 h-16 md:w-20 md:h-20 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
        processing: "Thinking...",
        speaking: "Speaking...",
        error: "Error occurred"
    };

    return (
        <div className="text-center mt-12 h-8">
            <p className={`text-xl font-medium transition-all duration-300 ${state === "recording" ? "text-blue-600 scale-110" :
                state === "processing" ? "text-purple-600 animate-pulse" :
                    state === "speaking" ? "text-green-600 scale-110" :
                        state === "error" ? "text-red-600" :
                            "text-gray-400"
                }`}>
                {messages[state]}
            </p>
        </div>
    );
}

// Conversation Display
function ConversationDisplay({ userText, aiText, isVisible }) {
    if (!isVisible && (!userText && !aiText)) return null;

    return (
        <div className={`w-full max-w-3xl mx-auto px-4 space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            {userText && (
                <div className="flex justify-end">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 text-gray-800 rounded-2xl rounded-tr-sm px-6 py-4 max-w-lg shadow-lg animate-slideInRight">
                        <p className="text-base leading-relaxed font-medium">{userText}</p>
                    </div>
                </div>
            )}

            {aiText && (
                <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl rounded-tl-sm px-6 py-4 max-w-lg shadow-lg animate-slideInLeft">
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>
                                {aiText}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

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

        // Keep conversation visible longer or until next interaction
        setTimeout(() => {
            // Optional: fade out or keep it
            // setShowConversation(false);
        }, 15000);
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
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onNewChat={handleNewChat}
                />

                <div className="flex-1 flex flex-col lg:ml-16 relative">
                    {/* Ambient Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(240,240,250,1))] -z-10"></div>
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-3xl"></div>
                        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl"></div>
                    </div>

                    <Navbar onMenuClick={() => setSidebarOpen(true)} />

                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden max-w-5xl mx-auto w-full">

                        {/* Conversation Display Area */}
                        {/* <div className="flex-1 w-full flex flex-col justify-center min-h-[200px]">
                            <ConversationDisplay
                                userText={currentUserText}
                                aiText={currentAiText}
                                isVisible={showConversation}
                            />
                        </div> */}

                        {/* Voice Controls Area */}
                        <div className="flex flex-col items-center justify-center pb-12 pt-8">
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
                            <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                                <p className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
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