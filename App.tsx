import React, { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "@firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from './services/firebase.ts';

import Sidebar from './Sidebar.tsx';
import Header from './components/Header.tsx';
import { PromptCard } from './components/PromptCard.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import ForgotPassword from './components/ForgotPassword.tsx';
import Profile from './components/Profile.tsx';
import OfflineBanner from './components/OfflineBanner.tsx';
import FeedbackModal from './components/FeedbackModal.tsx';
import HistoryPanel from './components/HistoryPanel.tsx';
import AdminPanel from './components/AdminPanel.tsx';

import { PROMPTS } from './constants.tsx';
import type { Prompt, UserProfile, PromptState, HistoryItem } from './types.ts';
import { Cog6ToothIcon } from './components/icons.tsx';

type AuthView = 'login' | 'register' | 'forgotPassword';
type MainView = number | 'profile' | 'admin';
type FeedbackMode = 'feedback' | 'support';

const FullPageLoader: React.FC = () => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]"></div>
        <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{animationDelay: '0.2s'}}></div>
        <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{animationDelay: '0.4s'}}></div>
    </div>
  </div>
);

type AllPromptStates = Record<number, Partial<PromptState>>;
type AllHistory = Record<number, HistoryItem[]>;


export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<MainView>(PROMPTS[0].id);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInitialViewApplied, setIsInitialViewApplied] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState<FeedbackMode>('feedback');
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  
  const [promptStates, setPromptStates] = useState<AllPromptStates>(() => {
    try {
        const savedStates = window.localStorage.getItem('sahayakAiPromptStates');
        return savedStates ? JSON.parse(savedStates) : {};
    } catch (error) {
        console.error("Could not load prompt states from localStorage", error);
        return {};
    }
  });

  const [history, setHistory] = useState<AllHistory>(() => {
    try {
        const savedHistory = window.localStorage.getItem('sahayakAiHistory');
        return savedHistory ? JSON.parse(savedHistory) : {};
    } catch (error) {
        console.error("Could not load history from localStorage", error);
        return {};
    }
  });


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
        window.localStorage.setItem('sahayakAiPromptStates', JSON.stringify(promptStates));
    } catch (error) {
        console.error("Could not save prompt states to localStorage", error);
    }
  }, [promptStates]);

  useEffect(() => {
    try {
        window.localStorage.setItem('sahayakAiHistory', JSON.stringify(history));
    } catch (error) {
        console.error("Could not save history to localStorage", error);
    }
  }, [history]);

  useEffect(() => {
    let unsubscribeFromSnapshot: (() => void) | null = null;

    const unsubscribeFromAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubscribeFromSnapshot) {
        unsubscribeFromSnapshot();
      }

      if (currentUser) {
        // Set a preliminary user object while we fetch the full profile
        const preliminaryUser: UserProfile = {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            role: 'Loading...', 
        };
        setUser(preliminaryUser);

        const userDocRef = doc(db, "users", currentUser.uid);

        unsubscribeFromSnapshot = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              const userProfileData = docSnap.data();
              setUser({
                uid: userProfileData.uid,
                displayName: userProfileData.displayName,
                email: userProfileData.email,
                role: userProfileData.role || 'Teacher', // Default to 'Teacher' if not specified
              });
            } else {
              console.warn("User document not found in Firestore. Using auth data as fallback.");
              setUser({
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                email: currentUser.email,
                role: 'Teacher', // Fallback role
              });
            }
            setIsAuthLoading(false);
          }, 
          (error) => {
            if (error.code !== 'unavailable') {
              console.error("Firestore snapshot listener failed:", error);
              setUser(prevUser => ({
                  ...(prevUser as UserProfile),
                  role: 'Profile Error',
              }));
            }
            setIsAuthLoading(false);
          }
        );
      } else {
        setUser(null);
        setIsAuthLoading(false);
      }
    });

    return () => {
      unsubscribeFromAuth();
      if (unsubscribeFromSnapshot) {
        unsubscribeFromSnapshot();
      }
    };
  }, []);

   useEffect(() => {
    if (user && !isInitialViewApplied) {
        if (user.email === 'laggalarakesh8@gmail.com') {
            setCurrentView('admin');
        } else {
            setCurrentView(PROMPTS[0].id);
        }
        setIsInitialViewApplied(true);
    } else if (!user) {
        setIsInitialViewApplied(false);
        setCurrentView(PROMPTS[0].id);
    }
  }, [user, isInitialViewApplied]);

  const handleSelectView = (view: MainView) => {
    setCurrentView(view);
  };

  const handleSelectProfile = () => {
    setCurrentView('profile');
  };
  
  const handleSelectAdmin = () => {
    setCurrentView('admin');
  };

  const handlePromptStateChange = (id: number, newState: Partial<PromptState>) => {
    setPromptStates(prevStates => ({
        ...prevStates,
        [id]: {
            ...(prevStates[id] || {}),
            ...newState,
        }
    }));
  };

  const handleAddToHistory = (promptId: number, item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      const newItem: HistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now()
      };

      setHistory(prev => {
          const newHistoryForPrompt = [newItem, ...(prev[promptId] || [])];
          if (newHistoryForPrompt.length > 50) { // Limit history size
              newHistoryForPrompt.pop();
          }
          return {
              ...prev,
              [promptId]: newHistoryForPrompt
          };
      });
  };

  const handleClearHistory = (promptId: number) => {
      setHistory(prev => {
          const newHistory = {...prev};
          delete newHistory[promptId];
          return newHistory;
      });
  };

  const handleSelectHistoryItem = (promptId: number, item: HistoryItem) => {
      handlePromptStateChange(promptId, {
          inputValue: item.userInput,
          secondaryInputValue: item.secondaryUserInput || '',
          markdownOutput: item.response,
          imageUrl: item.imageUrl,
          youtubeSuggestions: item.youtubeSuggestions,
          imageError: null,
          inputImage: null,
          inputAudio: null,
      });
      setCurrentView(promptId);
  };

  const handleOpenModal = (mode: FeedbackMode) => {
    setFeedbackMode(mode);
    setIsFeedbackModalOpen(true);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const selectedPrompt = useMemo(
    () => typeof currentView === 'number' ? PROMPTS.find((p: Prompt) => p.id === currentView) : null,
    [currentView]
  );
  
  const headerTitle = useMemo(() => {
    if (currentView === 'profile') return "User Profile";
    if (currentView === 'admin') return "Admin Panel";
    return selectedPrompt?.title || "SahayakAI";
  }, [currentView, selectedPrompt]);

  const headerIcon = useMemo(() => {
     if (currentView === 'profile') return null;
     if (currentView === 'admin') return <Cog6ToothIcon />;
     return selectedPrompt?.icon;
  }, [currentView, selectedPrompt]);


  if (isAuthLoading) {
    return <FullPageLoader />;
  }

  if (!user) {
    switch(authView) {
      case 'register':
        return <Register onSwitchView={setAuthView} />;
      case 'forgotPassword':
        return <ForgotPassword onSwitchView={setAuthView} />;
      case 'login':
      default:
        return <Login onSwitchView={setAuthView} />;
    }
  }
  
  const renderMainContent = () => {
    switch(currentView) {
        case 'profile':
            return <Profile user={user} />;
        case 'admin':
            return <AdminPanel />;
        default:
            return selectedPrompt && (
                <PromptCard 
                    key={selectedPrompt.id}
                    prompt={selectedPrompt}
                    persistedState={promptStates[selectedPrompt.id] || {}}
                    onStateChange={(newState) => handlePromptStateChange(selectedPrompt.id, newState)}
                    onAddToHistory={(item) => handleAddToHistory(selectedPrompt.id, item)}
                />
            );
    }
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-transparent">
      {!isOnline && <OfflineBanner />}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        mode={feedbackMode}
      />
      <Header 
        user={user} 
        title={headerTitle} 
        icon={headerIcon}
        onSelectProfile={handleSelectProfile} 
        onLogout={handleLogout}
        onOpenFeedbackModal={() => handleOpenModal('feedback')}
        onOpenSupportModal={() => handleOpenModal('support')}
        onSelectAdmin={handleSelectAdmin}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            currentView={currentView} 
            onSelectView={handleSelectView} 
            user={user}
            isOpen={isSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
            {renderMainContent()}
        </div>
         {typeof currentView === 'number' && (
            <HistoryPanel
                isVisible={isHistoryVisible}
                onToggle={() => setIsHistoryVisible(!isHistoryVisible)}
                history={history[currentView] || []}
                onSelectItem={(item) => handleSelectHistoryItem(currentView, item)}
                onClearHistory={() => handleClearHistory(currentView)}
            />
        )}
      </div>
    </div>
  );
};