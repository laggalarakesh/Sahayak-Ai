import React, { useState, useEffect, useRef, ReactElement } from 'react';
import type { UserProfile } from '../types.ts';
import { UserCircleIcon, ArrowLeftOnRectangleIcon, ChatBubbleBottomCenterTextIcon, QuestionMarkCircleIcon, Cog6ToothIcon, Bars3Icon } from './icons.tsx';

interface HeaderProps {
  user: UserProfile;
  title: string;
  icon: ReactElement<{ className?: string }> | null | undefined;
  onSelectProfile: () => void;
  onLogout: () => void;
  onOpenFeedbackModal: () => void;
  onOpenSupportModal: () => void;
  onSelectAdmin: () => void;
  onToggleSidebar: () => void;
}

const getInitials = (name: string | null) => {
  if (!name) return '??';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

const Header: React.FC<HeaderProps> = ({ user, title, icon, onSelectProfile, onLogout, onOpenFeedbackModal, onOpenSupportModal, onSelectAdmin, onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 bg-black/50 backdrop-blur-md border-b border-purple-500/50 px-4 py-3 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-full text-purple-300 hover:bg-purple-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        {icon && <div className="text-cyan-400">{React.cloneElement(icon, { className: "h-6 w-6" })}</div>}
        <h1 className="text-xl font-orbitron text-cyan-400 hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {user.email === 'laggalarakesh8@gmail.com' && (
            <button
            onClick={onSelectAdmin}
            className="w-10 h-10 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center justify-center text-white hover:bg-purple-500/20 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
            aria-label="Open Admin Panel"
            >
            <Cog6ToothIcon className="h-5 w-5" />
            </button>
        )}
        <button
          onClick={onOpenFeedbackModal}
          className="w-10 h-10 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:bg-purple-500/20 hover:text-white hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
          aria-label="Submit Feedback"
        >
          <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
        </button>
        
        <button
          onClick={onOpenSupportModal}
          className="w-10 h-10 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:bg-purple-500/20 hover:text-white hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
          aria-label="Contact Support"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-12 h-12 bg-cyan-500/50 border border-cyan-400/80 rounded-full flex items-center justify-center text-white font-bold text-base hover:bg-cyan-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            {getInitials(user.displayName)}
          </button>

          {isDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black/80 backdrop-blur-lg border border-purple-500/50 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" >
              <div className="py-1" role="none">
                <div className="px-4 py-2 border-b border-purple-500/30">
                    <p className="text-sm text-purple-300 font-mono" role="none">
                      Signed in as
                    </p>
                    <p className="text-sm font-medium text-white truncate font-mono" role="none">
                      {user.email}
                    </p>
                </div>
                <button
                  onClick={() => { onSelectProfile(); setIsDropdownOpen(false); }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-purple-500/20"
                  role="menuitem"
                >
                  <UserCircleIcon className="mr-3 h-5 w-5 text-cyan-400"/>
                  View Profile
                </button>
                <div className="border-t border-purple-500/30 my-1"></div>
                <button
                  onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-pink-400 hover:bg-pink-800/60 hover:text-pink-300"
                  role="menuitem"
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5"/>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;