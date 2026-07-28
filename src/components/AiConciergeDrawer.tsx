import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Loader2, Bot, User, Compass, HelpCircle } from 'lucide-react';

interface AiConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

interface Message {
  sender: 'user' | 'aiden';
  text: string;
}

export const AiConciergeDrawer: React.FC<AiConciergeDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'aiden',
      text: "Greetings! I am Aiden, your 24/7 AI Travel Specialist. How may I assist with your flight connections, visa requirements, luxury hotel bookings, or local etiquette recommendations today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/travel-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages([...newMessages, { sender: 'aiden', text: data.answer }]);
      } else {
        setMessages([...newMessages, { sender: 'aiden', text: "I'm temporarily unable to reach the travel database. Please try again shortly." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: 'aiden', text: "An unexpected connection error occurred. Please try asking again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-emerald-900/20">
        {/* Drawer Header */}
        <div className="bg-[#0D3B2B] text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E88B23] text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif">Aiden AI Concierge</h3>
              <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                24/7 Global Intelligence Active
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-emerald-50/60 border-b border-emerald-100 flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block w-full">Quick Questions:</span>
          {[
            'Best season for Kyoto?',
            'Visa rules for Schengen',
            'Serengeti packing tips',
            'Top dining in Positano',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200 font-medium transition-colors"
            >
              + {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'aiden' && (
                <div className="w-7 h-7 rounded-full bg-[#0D3B2B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                  A
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0D3B2B] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 border border-gray-200/80 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center text-gray-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#0D3B2B]" />
              <span>Aiden is consulting travel sources...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your destination..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0D3B2B]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#0D3B2B] hover:bg-[#08291e] text-white p-2.5 rounded-xl transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-[#E88B23]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
