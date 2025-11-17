"use client";

import React, { useState, useRef } from "react";

// --------------------------------------------
// Chat Bubble Component
// --------------------------------------------
function ChatBubble({ text, sender }) {
    return (
        <div className={`w-full flex ${sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`px-4 py-2 rounded-xl max-w-[70%] text-sm shadow-md ${sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
            >
                {text}
            </div>
        </div>
    );
}

// --------------------------------------------
// Voice Recorder Component
// --------------------------------------------
function VoiceRecorder({ onResult, sessionId, setSessionId }) {
    const [isRecording, setRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);

        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);

        mediaRecorder.current.onstop = () => {
            const blob = new Blob(audioChunks.current, { type: "audio/mpeg" });
            sendToBackend(blob);
        };

        mediaRecorder.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setRecording(false);
    };

    // --------------------------------------------
    // Send audio → FastAPI (/voice/main)
    // With session_id
    // --------------------------------------------
    const sendToBackend = async (blob) => {
        const formData = new FormData();
        const file = new File([blob], "voice.mp3", { type: "audio/mpeg" });

        formData.append("file", file);

        // Add session_id if available
        if (sessionId) formData.append("session_id", sessionId);

        const res = await fetch("http://localhost:8000/voice/main", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        // Update session ID if new
        if (data.session_id) {
            setSessionId(data.session_id);
        }

        onResult(data);

        // Play AI response
        if (data.audio_base64) {
            const bytes = Uint8Array.from(atob(data.audio_base64), (c) => c.charCodeAt(0));
            const audioBlob = new Blob([bytes], { type: "audio/mpeg" });
            const url = URL.createObjectURL(audioBlob);
            new Audio(url).play();
        }
    };

    return (
        <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-full shadow-lg text-white text-lg font-medium mt-4 ${isRecording ? "bg-red-600 animate-pulse" : "bg-blue-600"
                }`}
        >
            {isRecording ? "Stop Recording" : "Speak"}
        </button>
    );
}

// --------------------------------------------
// Main Page
// --------------------------------------------
export default function VoicePage() {
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null); // ← store session id here

    const handleResult = (data) => {
        setMessages((prev) => [
            ...prev,
            { text: data.text, sender: "user" },
            { text: data.reply, sender: "ai" },
        ]);
    };

    return (
        <main className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-6">🎤 NBFC Voice Assistant</h1>

            <div className="bg-gray-100 rounded-xl p-4 h-[70vh] overflow-y-auto shadow-inner">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        Tap "Speak" to start the voice conversation.
                    </div>
                ) : (
                    messages.map((msg, index) => <ChatBubble key={index} text={msg.text} sender={msg.sender} />)
                )}
            </div>

            <div className="flex justify-center">
                <VoiceRecorder
                    onResult={handleResult}
                    sessionId={sessionId}
                    setSessionId={setSessionId}
                />
            </div>

            {sessionId && (
                <p className="text-center text-gray-400 text-xs mt-2">
                    Session ID: {sessionId}
                </p>
            )}
        </main>
    );
}
