"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function TravelGuideWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 I am your local guide. Ask me anything about the city or how to use this website!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/travel-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer || "Sorry, the guide is offline!" }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I'm having a connection issue!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[450px] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#53B788]/20 transition-all duration-300 ease-in-out hero-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B9ECC] to-[#52B788] text-white p-4 font-semibold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span>India Travel Guide AI</span>
            </div>
            <button onClick={toggleChat} className="hover:opacity-80 transition-opacity">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/30 text-sm leading-relaxed space-y-4 flex flex-col">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#3B9ECC] to-[#52B788] text-white rounded-tr-sm shadow-md'
                      : 'bg-[#eaf4ef] text-[#1a2e26] border border-[#52B788]/20 rounded-tl-sm shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }}
                />
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#eaf4ef] text-[#1a2e26] border border-[#52B788]/20 p-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] animate-pulse flex items-center gap-2">
                  <Bot size={16} className="text-[#3B9ECC] animate-bounce-slow" />
                  <span>Guide is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-[#52B788]/20 flex gap-2 bg-background">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a city..."
              className="flex-1 px-4 py-2 bg-white border border-[#52B788]/30 rounded-full outline-none focus:ring-2 focus:ring-[#3B9ECC]/50 transition-all text-sm text-foreground"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-[#3B9ECC] to-[#52B788] text-white p-2 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-gradient-to-r from-[#3B9ECC] to-[#52B788] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform duration-300 animate-bounce-slow"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
