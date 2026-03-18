import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Info,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import GatorAvatar from './GatorAvatar';

const GATOR_ONE_LINERS = [
  "Why don't gators use computers? They're afraid of the Windows!",
  "I'm feeling snappy today, cher!",
  "See you later, alligator! But first, grab some beignets!",
];

const CAJUN_FACTS = [
  "The 'Holy Trinity' is onion, celery, and bell pepper.",
  "Mardi Gras means 'Fat Tuesday' in French.",
  "Po-boys got their name during a 1929 streetcar strike.",
];

const GatorBobWidget: React.FC = () => {
  interface Message {
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
  }
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hey there, cher! I'm Gator Bob. Welcome to The Cajun Menu! I'm all dressed up for the parade and ready to help you find the best eats in Canton! Ask me about our menu, Cajun culture, or even my dance moves!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isDancing, setIsDancing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const minimizedRef = useRef(isMinimized);
  const notifyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    minimizedRef.current = isMinimized;
  }, [isMinimized]);

  const triggerDance = useCallback(() => {
    setIsDancing(true);
    setTimeout(() => setIsDancing(false), 5000);
  }, []);

  const triggerNotification = useCallback(() => {
    if (!minimizedRef.current) return;
    setShowNotification(true);
    if (notifyTimerRef.current) {
      window.clearTimeout(notifyTimerRef.current);
    }
    notifyTimerRef.current = window.setTimeout(() => setShowNotification(false), 12000);
  }, []);

  const addBotMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: 'model', text, timestamp: new Date() }]);
    triggerNotification();
  }, [triggerNotification]);

  useEffect(() => {
    if (!isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  useEffect(() => {
    const jokeTimer = setInterval(() => {
      const joke = GATOR_ONE_LINERS[Math.floor(Math.random() * GATOR_ONE_LINERS.length)];
      addBotMessage(`🐊 *Snaps Tail* 🐊\n${joke}`);
      triggerDance();
    }, 4 * 60 * 1000);

    const factTimer = setInterval(() => {
      const fact = CAJUN_FACTS[Math.floor(Math.random() * CAJUN_FACTS.length)];
      addBotMessage(`Did ya know? 🎺\n${fact}`);
    }, 6 * 60 * 1000);

    return () => {
      clearInterval(jokeTimer);
      clearInterval(factTimer);
    };
  }, [addBotMessage, triggerDance]);

  useEffect(() => {
    return () => {
      if (notifyTimerRef.current) {
        window.clearTimeout(notifyTimerRef.current);
      }
    };
  }, []);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    if (!overrideInput) setInput('');

    const userMsg: Message = { role: 'user', text: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setIsMinimized(false);

    if (textToSend.toLowerCase().includes('dance')) {
      setTimeout(() => {
        addBotMessage("Whoo-whee! Watch me move, cher! *Starts Cajun Shuffle*");
        triggerDance();
        setIsTyping(false);
      }, 1000);
      return;
    }

    const response = getLocalResponse(textToSend);
    setMessages((prev) => [...prev, { role: 'model', text: response, timestamp: new Date() }]);
    setIsTyping(false);
  };

  const getLocalResponse = (text: string) => {
    const msg = text.toLowerCase();
    if (msg.includes('hours') || msg.includes('open')) {
      return "We’re open Sunday 12PM–5PM, Wednesday/Thursday 11AM–8PM, and Friday/Saturday 11AM–8PM. Closed Monday and Tuesday.";
    }
    if (msg.includes('address') || msg.includes('location') || msg.includes('where')) {
      return "You can find us at 140 Keith Dr, Canton, GA 30114.";
    }
    if (msg.includes('phone') || msg.includes('call')) {
      return "Call us at 678-899-7404, cher!";
    }
    if (msg.includes('email')) {
      return "Email us at thecajunmenu@gmail.com.";
    }
    if (msg.includes('menu') || msg.includes('food')) {
      return "Favorites include Creamy Crab Dip, Bayou Low Boil, Alligator Bites, and Crawfish Queso. What are you craving?";
    }
    if (msg.includes('fact')) {
      return `Did ya know? ${CAJUN_FACTS[Math.floor(Math.random() * CAJUN_FACTS.length)]}`;
    }
    return "I'm Gator Bob. Ask me about our menu, hours, or location!";
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div
      className="fixed z-[9999] flex flex-col items-end pointer-events-none"
      style={{ bottom: 20, right: 20 }}
    >
      {isMinimized ? (
        <div className="flex flex-col items-end gap-3 group">
          {(showNotification || isTyping) && (
            <div
              className="bg-white text-black p-4 rounded-3xl rounded-br-none shadow-2xl border-2 border-gold-mg max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto cursor-pointer relative"
              onClick={() => setIsMinimized(false)}
            >
              <div className="absolute -top-3 -left-3 bg-purple-mg text-white p-1.5 rounded-full shadow-lg">
                <Sparkles size={16} className="animate-pulse" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-purple-mg uppercase tracking-widest">Gator Bob's Quick Talk</p>
                  <X size={14} className="text-gray-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setShowNotification(false); }} />
                </div>
                <p className="text-xs leading-relaxed italic font-medium line-clamp-3">
                  {isTyping ? "Snap snap... Bob is writing back!" : `"${lastMessage.text}"`}
                </p>
                {!isTyping && (
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
                      className="flex-1 bg-purple-mg text-white text-[10px] font-bold py-1.5 rounded-full shadow-md transition-all"
                    >
                      Reply to Bob
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsMinimized(false)}
            className="relative cursor-pointer hover:scale-105 transition-all duration-500 pointer-events-auto group p-1"
          >
            <div className="absolute inset-[-6px] rounded-full bg-gradient-to-tr from-purple-mg via-green-mg to-gold-mg animate-spin duration-3000 opacity-20 blur-md group-hover:opacity-50" />
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#121212] to-black rounded-full border-4 border-gold-mg shadow-[0_0_40px_rgba(255,215,0,0.3)] overflow-hidden flex items-center justify-center relative z-10">
              <GatorAvatar size="sm" isTalking={isTyping || showNotification} isDancing={isDancing} />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm text-gold-mg px-3 py-1 rounded-full text-[10px] font-black border border-gold-mg/50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              SNAP WITH BOB
            </div>
          </button>
        </div>
      ) : (
        <div className="w-[90vw] md:w-[450px] h-[75vh] md:h-[650px] bg-black/90 backdrop-blur-2xl rounded-[2.5rem] border border-gold-mg/30 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col pointer-events-auto animate-in zoom-in-95 duration-300 origin-bottom-right">
          <div className="p-6 bg-gradient-to-r from-purple-mg/20 to-green-mg/20 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border-2 border-gold-mg shadow-lg overflow-hidden relative">
                <GatorAvatar size="sm" isTalking={isTyping} isDancing={isDancing} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Gator Bob</h3>
                <p className="text-[10px] text-green-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online in the Bayou
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white"
                title="Minimize Chat"
              >
                <ChevronDown size={24} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/60 hover:text-white">
                <Info size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-black/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-500`}
              >
                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-[1.5rem] shadow-xl relative ${msg.role === 'user'
                      ? 'bg-blue-mg text-white rounded-tr-none'
                      : 'bg-gradient-to-br from-green-mg to-emerald-950 text-white rounded-tl-none border border-white/10'
                      }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase px-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-[1.5rem] flex gap-1.5 shadow-inner border border-white/5">
                  <div className="w-2 h-2 bg-purple-mg rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-green-mg rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gold-mg rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-black border-t border-white/5">
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Talk to Bob..."
                  className="w-full bg-white/[0.05] text-white placeholder-gray-500 p-4 pr-12 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-gold-mg/30 transition-all text-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                  <MessageCircle size={18} />
                </div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={`p-4 rounded-2xl transition-all flex items-center justify-center ${!input.trim() || isTyping ? 'bg-white/5 text-gray-700' : 'bg-gold-mg text-black shadow-lg shadow-gold-mg/20 active:scale-90'
                  }`}
              >
                <Send size={20} />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button onClick={() => handleSend("Menu please!")} className="text-[9px] font-black text-gray-500 hover:text-gold-mg uppercase transition-colors px-2 py-1 rounded border border-white/5 hover:border-gold-mg/20">Menu</button>
              <button onClick={() => handleSend("Culture fact!")} className="text-[9px] font-black text-gray-500 hover:text-green-mg uppercase transition-colors px-2 py-1 rounded border border-white/5 hover:border-green-mg/20">Facts</button>
              <button onClick={() => handleSend("Dance Bob!")} className="text-[9px] font-black text-gray-500 hover:text-purple-mg uppercase transition-colors px-2 py-1 rounded border border-white/5 hover:border-purple-mg/20">Dance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatorBobWidget;
