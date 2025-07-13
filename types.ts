import type { ReactElement } from 'react';

export interface Prompt {
  id: number;
  title: string;
  description:string;
  promptTemplate?: string;
  icon: ReactElement<{ className?: string }>;
  inputLabel?: string;
  inputPlaceholder?: string;
  defaultInput?: string;
  secondaryInputLabel?: string;
  secondaryInputPlaceholder?: string;
  questionCountLabel?: string;
  defaultQuestionCount?: number;
  lowLatency?: boolean;
  showLanguageSelector?: boolean;
  generatesVisualAid?: boolean;
  showImageInput?: boolean;
  showAudioInput?: boolean;
  canSynthesizeSpeech?: boolean;
  suggestsYouTube?: boolean;
}

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    role: string;
};

export interface HistoryItem {
  id: string;
  userInput: string;
  secondaryUserInput?: string;
  response: string;
  imageUrl?: string | null;
  youtubeSuggestions?: { title: string; url: string; }[] | null;
  timestamp: number;
}

export interface PromptState {
  inputValue: string;
  secondaryInputValue: string;
  language: string;
  questionCount: number;
  markdownOutput: string;
  imageUrl?: string | null;
  imageError?: string | null;
  inputImage?: { type: string; data: string; } | null;
  inputAudio?: { type: string; data: string; url: string; } | null;
  youtubeSuggestions?: { title: string; url: string; }[] | null;
}

export interface AboutContent {
  purpose: string;
  useInClassrooms: string;
  technologies: string;
  disclaimer: string;
  aboutAi: string;
  features: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}