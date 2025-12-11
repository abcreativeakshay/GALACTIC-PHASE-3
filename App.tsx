import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from './services/geminiService';
import { StudyGuideData, Message } from './types';
import StudyGuideRenderer from './components/StudyGuideRenderer';
import Typewriter from './components/Typewriter';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import { Send, Bot, User, Sparkles, AlertCircle, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentGuide, setCurrentGuide] = useState<StudyGuideData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('home'); // home | chat | archives | status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeView]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    // Switch to guide view if search is initiated
    // But keep chat visible in the split pane
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    // On mobile, if sending a message, ensure we are looking at the chat or results?
    // For this layout, chat is always on the left.

    try {
      const historyForApi = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const { text, studyGuide } = await generateResponse(userMsg.content, historyForApi);

      if (studyGuide) {
        setCurrentGuide(studyGuide);
        setActiveView('home'); // Logic: 'home' here refers to the active tab in sidebar, but visually we show guide. 
        // Actually, let's keep 'home' as dashboard. If we have guide, we are in "Analysis Mode".
        // Let's rely on `currentGuide` existence to overlay the Home Page.
        
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: `Uplink established. Data matrix for [${studyGuide.modelName}] received. Rendering tactical display...`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      }

    } catch (err: any) {
      setError(err.message || "Communication disruption detected.");
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "⚠️ SYSTEM ALERT: Connection to Archives Failed. Please retry transmission.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSidebarNavigate = (view: string) => {
    setActiveView(view);
    if (view === 'home') {
        setCurrentGuide(null); // Reset to dashboard
    }
    // Mobile handling could go here
  };

  const handleQuickAction = (query: string) => {
      handleSend(query);
  };

  return (
    <div className="h-screen bg-space-900 text-slate-200 font-sans flex overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-800 via-space-900 to-black pointer-events-none z-0"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-10"></div>
      
      {/* Sidebar */}
      <Sidebar activeView={currentGuide ? 'analysis' : activeView} onNavigate={handleSidebarNavigate} />
      
      {/* Mobile Header / Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-space-900/90 backdrop-blur z-50 border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Bot className="text-cyan-500" size={24} />
            <span className="font-display font-bold text-white">NOVA-7</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
              <Menu />
          </button>
      </div>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row h-full relative z-10 pt-16 md:pt-0">
        
        {/* Left Panel: Chat / Command Console */}
        {/* On mobile, this might be hidden if we are viewing the guide, or we stack them? 
            For now, simpler glassmorphic layout: Chat panel is persistent on desktop. */}
        <div className="w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-white/5 bg-space-900/80 backdrop-blur-md shadow-2xl shrink-0">
            
            {/* Chat Header */}
            <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-400">
                            <Bot className="text-white" size={20} />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-space-900 rounded-full"></span>
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-white tracking-wider text-sm">NOVA-7 UPLINK</h1>
                        <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase opacity-70">
                            Ready for Command
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                {messages.length === 0 && (
                    <div className="text-center py-10 opacity-60">
                        <Sparkles className="mx-auto mb-4 text-cyan-500 animate-pulse" size={32} />
                        <p className="font-mono text-sm text-cyan-300">SYSTEM READY.</p>
                        <p className="text-xs mt-2 max-w-[250px] mx-auto text-slate-400">
                            "Search Transformer" to begin tactical analysis.
                        </p>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-slate-700/50 border-slate-600' : 'bg-cyan-900/30 border-cyan-700/50'}`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-cyan-400" />}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                            msg.role === 'user' 
                                ? 'bg-slate-800/80 text-white border border-slate-700/50 rounded-tr-none' 
                                : 'bg-cyan-950/40 text-cyan-100 border border-cyan-900/30 rounded-tl-none'
                        }`}>
                            {msg.role === 'model' ? (
                                <Typewriter text={msg.content} speed={5} />
                            ) : (
                                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                            )}
                            <div className="text-[9px] mt-1.5 opacity-40 font-mono text-right tracking-wider">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-700 flex items-center justify-center shrink-0">
                            <Bot size={14} className="text-cyan-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                             <div className="flex gap-1 h-8 items-center">
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                             </div>
                             <span className="text-[10px] font-mono text-cyan-500/70">DECRYPTING...</span>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300 text-xs backdrop-blur-md">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-space-900/50 border-t border-white/5 backdrop-blur-lg">
                <div className="relative group">
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-lg blur transition-opacity opacity-0 group-hover:opacity-100"></div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter mission command..."
                        className="relative w-full bg-black/40 text-white pl-4 pr-12 py-3.5 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 font-mono text-sm placeholder:text-slate-600 transition-all shadow-inner"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 text-cyan-500 hover:text-white hover:bg-cyan-600 rounded transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cyan-500"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* Right Panel: Holographic Display / Main Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            {/* Scan line animation overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10%] w-full animate-scan pointer-events-none z-0"></div>
            <div className="absolute inset-0 bg-space-900/30 z-0 pointer-events-none"></div>

            {currentGuide ? (
                <div className="relative z-10 h-full p-4 md:p-6 overflow-hidden">
                    <StudyGuideRenderer data={currentGuide} />
                </div>
            ) : (
                <div className="relative z-10 h-full overflow-hidden">
                    <HomePage onQuickAction={handleQuickAction} />
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default App;