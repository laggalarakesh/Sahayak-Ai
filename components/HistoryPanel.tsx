import React, { useState } from 'react';
import type { HistoryItem } from '../types.ts';
import { ArchiveBoxIcon, ChevronLeftIcon, ChevronRightIcon } from './icons.tsx';

interface HistoryPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isVisible,
  onToggle,
  history,
  onSelectItem,
  onClearHistory,
}) => {
  return (
    <div className="flex flex-shrink-0">
      <div className={`
        bg-black/30 backdrop-blur-md border-l border-purple-500/30 flex flex-col h-full
        transition-all duration-300 ease-in-out
        ${isVisible ? 'w-full md:w-64 lg:w-72' : 'w-0'}
      `}>
        {isVisible && (
          <div className="flex flex-col h-full p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/30 mb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ArchiveBoxIcon className="h-5 w-5 text-cyan-400" />
                <h2 className="text-lg font-orbitron text-white">History</h2>
              </div>
              <button
                onClick={onClearHistory}
                disabled={history.length === 0}
                className="text-xs text-purple-300 hover:text-white hover:bg-purple-500/20 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Clear history for this tool"
              >
                Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              {history.length === 0 ? (
                <div className="text-center text-purple-300/70 pt-10 text-sm font-mono">
                  <p>No history for this tool yet.</p>
                  <p className="mt-2">Generated content will appear here.</p>
                </div>
              ) : (
                <ul>
                  {history.map((item) => (
                    <li key={item.id} className="mb-2">
                      <button
                        onClick={() => onSelectItem(item)}
                        className="w-full text-left p-2 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-purple-500/20 border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        title={`Load response for: ${item.userInput}`}
                      >
                        <p className="text-sm font-medium truncate">
                          <span className="mr-2 text-cyan-400">»</span>
                           Topic: {item.userInput}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 pl-5 font-mono">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-purple-500/30 text-center text-xs text-gray-500 flex-shrink-0 font-mono">
                <p>🗂️ Tip: Your search history is saved only on this device.</p>
            </div>
          </div>
        )}
      </div>

       <button
        onClick={onToggle}
        className="bg-black/30 hover:bg-purple-900/40 text-purple-300 hover:text-white h-16 w-6 self-center rounded-l-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-inset border-y border-l border-purple-500/30"
        aria-label={isVisible ? "Collapse history panel" : "Expand history panel"}
      >
        {isVisible ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default HistoryPanel;