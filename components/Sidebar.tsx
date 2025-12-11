import React from 'react';
import { Home, MessageSquare, Database, Settings, Activity, Hexagon } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Mission Control' },
    { id: 'chat', icon: MessageSquare, label: 'Comms Uplink' },
    { id: 'archives', icon: Database, label: 'Archives' },
    { id: 'status', icon: Activity, label: 'System Status' },
  ];

  return (
    <div className="hidden md:flex flex-col items-center w-20 lg:w-24 h-screen py-8 bg-space-900/60 backdrop-blur-xl border-r border-white/10 z-50 shrink-0">
      <div className="mb-10 group cursor-pointer relative">
        <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative w-12 h-12 flex items-center justify-center">
            <Hexagon size={40} className="text-cyan-500 fill-cyan-900/50 animate-pulse-slow" strokeWidth={1.5} />
            <span className="absolute text-[10px] font-bold text-cyan-100 font-display">N7</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-6 w-full px-2">
        {menuItems.map((item) => {
           const Icon = item.icon;
           const isActive = activeView === item.id;
           return (
             <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative group w-full flex flex-col items-center justify-center gap-1 transition-all duration-300 py-3 rounded-xl ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-110' : 'group-hover:bg-white/5'}`}>
                    <Icon size={22} strokeWidth={1.5} />
                </div>
                
                {/* Tooltip */}
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-space-900/90 backdrop-blur border border-cyan-500/30 rounded text-[10px] font-mono tracking-wider text-cyan-100 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none translate-x-2 group-hover:translate-x-0">
                    {item.label}
                    <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-space-900 border-l border-b border-cyan-500/30 transform rotate-45"></span>
                </span>

                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-l-full shadow-[0_0_10px_#06b6d4]"></div>}
             </button>
           );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-4">
         <button className="text-slate-600 hover:text-cyan-500 transition-colors p-3 hover:bg-white/5 rounded-xl">
            <Settings size={20} />
         </button>
         <div className="text-[9px] font-mono text-slate-700 writing-vertical-rl rotate-180 tracking-widest opacity-50">
             V2.4.1-STABLE
         </div>
      </div>
    </div>
  );
};

export default Sidebar;