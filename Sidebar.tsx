import React from 'react';
import { PROMPTS } from './constants.tsx';
import type { Prompt, UserProfile } from './types.ts';

interface SidebarProps {
  currentView: number | string;
  onSelectView: (id: number | string) => void;
  user: UserProfile | null;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, isOpen }) => {
  return (
    <aside className={`bg-black/30 backdrop-blur-md border-r border-purple-500/30 flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-64 p-4' : 'w-0 p-0'}`}>
      <div className="flex-1 overflow-y-auto">
          <h1 className="text-xl font-orbitron text-cyan-400 mb-2 pt-4">SahayakAI</h1>
          <h2 className="text-sm text-purple-400 mb-6 font-orbitron">AI Tools</h2>
          <nav>
            <ul>
              {PROMPTS.map((prompt: Prompt) => (
                <li key={prompt.id} className="mb-2">
                  <button
                    onClick={() => onSelectView(prompt.id)}
                    title={prompt.title}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left group ${
                      currentView === prompt.id
                        ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_theme(colors.cyan.500)]'
                        : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                    }`}
                  >
                    <div className="mr-3 shrink-0 text-purple-400 group-hover:text-cyan-300 transition-colors">{prompt.icon}</div>
                    <span className="flex-1 text-sm font-medium whitespace-nowrap">{prompt.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
      </div>
    </aside>
  );
};

export default Sidebar;