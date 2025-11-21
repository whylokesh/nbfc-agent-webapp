"use client"
import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Mic, Settings, User, Menu, X, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

// Sidebar Component
const Sidebar = ({ isOpen, onClose, currentPage, onNavigate, onNewChat }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-16 flex flex-col items-center py-4
      `}>
        {/* Logo */}
        <div className="mb-8 w-10 h-10 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center">
            <Image src="/images/artificial-intelligence.png" width={32} height={32} alt="LOS AI Logo" />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col gap-2 w-full px-2">
          <button
            onClick={() => onNavigate('/chat')}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all
              ${currentPage === '/chat'
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

        {/* New Chat Button */}
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
      {/* Left: Menu Button (Mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center: Title (Desktop) */}
      <div className="hidden lg:block">
        <h1 className="text-black font-medium text-sm">LOS AI</h1>
      </div>

      {/* Mobile Center: Title */}
      <div className="lg:hidden flex-1 text-center">
        <h1 className="text-black font-medium text-sm">LOS AI</h1>
      </div>

      {/* Right: Actions */}
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

// Welcome Screen Component
const WelcomeScreen = ({ onSend }) => {
  const allSuggestions = [
    "Show top 5 lead sources",
    "Highest loan amount requested?",
    "Most common loan purpose?",
    "Highest sanction amount?",
    "Top branches by sanctioned loans",
    // "Ping sales team about this",
    "List rejected applications",
    "Show pending follow-ups"
  ];

  const [randomSuggestions, setRandomSuggestions] = useState([]);

  useEffect(() => {
    // Shuffle and pick 4
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    setRandomSuggestions(shuffled.slice(0, 4));
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center px-4 pb-20">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="my-8 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center">
            <Image src="/images/artificial-intelligence.png" width={64} height={64} alt="LOS AI Logo" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-black mb-3">
          How can I help you today?
        </h1>

        <p className="text-gray-600 text-base mb-10">
          Your intelligent AI assistant for the LOS Platform
        </p>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {randomSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSend({ role: "user", content: suggestion })}
              className="p-4 text-left bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all text-sm text-black truncate"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0">
          <Image src="/images/artificial-intelligence.png" width={32} height={32} alt="LOS AI Logo" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${isUser
          ? 'bg-black text-white'
          : 'bg-gray-100 text-black'
          }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-black">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-black">{children}</li>,
                  code: ({ children }) => <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs text-black">{children}</code>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>,
                  tr: ({ children }) => <tr className="transition-colors hover:bg-gray-50/50">{children}</tr>,
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{children}</td>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-gray-700" />
        </div>
      )}
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0">
        <Image src="/images/artificial-intelligence.png" width={32} height={32} alt="LOS AI Logo" />
      </div>
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

// Chat Input Component
const ChatInput = ({ onSend, disabled }) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length > 4000) return;
    setContent(value);
  };

  const handleSend = () => {
    if (!content.trim() || disabled) return;
    onSend({ role: "user", content: content.trim() });
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-gray-300 transition-colors">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-black placeholder-gray-500 text-sm resize-none focus:outline-none min-h-[24px] max-h-[120px]"
            placeholder="Message LOS AI..."
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
          />
          <button
            onClick={handleSend}
            disabled={!content.trim() || disabled}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${content.trim() && !disabled
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          LOS AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

// Main Chat Container Component
const ChatContainer = ({ messages, loading, onSend, onReset }) => {
  const messagesEndRef = useRef(null);
  const hasMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!hasMessages && !loading ? (
          <WelcomeScreen onSend={onSend} />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSend} disabled={loading} />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
          transition: background 0.2s;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f5f5f5;
        }
      `}</style>
    </div>
  );
};

// Main Page Component
export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('/chat');

  const handleSend = async (message) => {
    setMessages(prev => [...prev, message]);
    setLoading(true);

    try {
      const requestBody = {
        message: message.content,
        session_id: sessionId || ""
      };

      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.session_id) {
        setSessionId(data.session_id);
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.message || data.response || 'No response received'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setLoading(false);
    setSessionId(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    if (page === '/voice') {
      window.location.href = '/voice';
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onNewChat={handleReset}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-16">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Chat Container */}
        <ChatContainer
          messages={messages}
          loading={loading}
          onSend={handleSend}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}