'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const NetworkLogo = ({ className }) => (
  <img
    src="/images/logo.png"
    alt="SK Assistant Logo"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const canSend = content.trim() && !disabled;

  return (
    <div className="relative">
      <div className="flex items-end gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-transparent placeholder-gray-500 text-gray-900 text-base leading-6 min-h-[24px] max-h-[200px] focus:outline-none mb-1"
          placeholder="Ask about loan leads, applications, follow-ups, or sales team notifications..."
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${canSend
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-8 h-8 shrink-0">
        <NetworkLogo className="w-full h-full" />
      </div>
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-sm text-gray-500 ml-2">Analyzing...</span>
      </div>
    </div>
  );
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-4 mb-8 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${isUser
        ? 'bg-gray-200 text-gray-600'
        : ''
        }`}>
        {isUser ? (
          <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
        ) : (
          <NetworkLogo className="w-8 h-8" />
        )}
      </div>

      <div className={`max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl ${isUser
          ? 'bg-blue-600 text-white rounded-tr-sm'
          : 'bg-gray-50 text-gray-900 rounded-tl-sm'
          }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap text-base leading-7">
              {message.content}
            </div>
          ) : (
            <div className="text-base leading-7 prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-outside mb-3 ml-4 space-y-1.5">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside mb-3 ml-4 space-y-1.5">{children}</ol>,
                  li: ({ children }) => <li className="pl-1">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-gray-900">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-1.5 mt-3 first:mt-0 text-gray-900">{children}</h3>,
                  code: ({ children }) => <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-200 p-3 rounded mb-3 overflow-x-auto text-sm">{children}</pre>,
                  hr: () => <hr className="my-4 border-gray-300" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WelcomeSection = ({ onSend }) => {
  const suggestions = [
    "Show top 5 leads by score this week",
    "List applications rejected last month and reasons",
    "Ping the sales team for lead 123 with an urgent follow-up",
    "What are the pending follow-ups for this week?"
  ];

  const handleSuggestionClick = (suggestion) => {
    onSend({ role: "user", content: suggestion });
  };

  return (
    <div className="text-center py-12">
      <div className="flex items-center justify-center mb-6">
        <div className="w-24 h-24">
          <NetworkLogo className="w-full h-full" />
        </div>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
        <span className="">
          SK Assistant
        </span>
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
        Your intelligent AI assistant for SK Finance. Navigate through loan leads, analyze applications, and streamline your sales operations with powerful insights.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="p-4 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium group-hover:text-blue-600 transition-colors">
                {suggestion}
              </span>
              <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <NetworkLogo className="w-full h-full" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-lg tracking-tight">SK Assistant</h1>
            <p className="text-sm text-gray-500 font-normal">AI-Powered Lead Intelligence</p>
          </div>
        </div>

        {hasMessages && (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4">
          {!hasMessages && !loading && <WelcomeSection onSend={onSend} />}

          {hasMessages && (
            <div className="py-8">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
          )}

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={onSend} disabled={loading} />
          <p className="text-xs text-gray-500 mt-3 text-center">
            SK Assistant can make mistakes. Please verify important loan and lead information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const handleSend = async (message) => {
    setMessages(prev => [...prev, message]);
    setLoading(true);

    try {
      // Prepare request body
      const requestBody = {
        message: message.content,
        session_id: sessionId || "" // Send empty string for new chats, or existing session_id
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

      // Extract and update session_id from response if present
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Create assistant message from response
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
    setSessionId(null); // Reset session_id for new chat
  };

  return (
    <ChatContainer
      messages={messages}
      loading={loading}
      onSend={handleSend}
      onReset={handleReset}
    />
  );
}