

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Prompt, PromptState, HistoryItem } from '../types.ts';
import { generateContentStream, generateImage } from '../services/geminiService.ts';
import { searchYouTube } from '../services/youtubeService.ts';
import { ClipboardDocumentIcon, CheckIcon, PhotoIcon, XCircleIcon, MicrophoneIcon, StopCircleIcon, ArrowDownTrayIcon, PlayCircleIcon, VideoCameraIcon, PaperAirplaneIcon } from './icons.tsx';

interface PromptCardProps {
  prompt: Prompt;
  persistedState: Partial<PromptState>;
  onStateChange: (newState: Partial<PromptState>) => void;
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const TextLoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full animate-pulse bg-cyan-400"></div>
        <div className="w-2 h-2 rounded-full animate-pulse bg-cyan-400" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 rounded-full animate-pulse bg-cyan-400" style={{animationDelay: '0.4s'}}></div>
    </div>
);

const ImageLoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-black/30 rounded-lg">
        <div className="w-8 h-8 border-4 border-cyan-400 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-cyan-300 font-orbitron">Drawing on the blackboard...</p>
    </div>
);

const ImageError: React.FC<{ message: string }> = ({ message }) => (
     <div className="flex flex-col items-center justify-center h-64 bg-pink-900/20 border border-pink-700/50 rounded-lg p-4">
        <p className="text-pink-300 font-bold font-orbitron">SYSTEM ERROR</p>
        <p className="text-pink-400 text-sm mt-2 text-center font-mono">{message}</p>
    </div>
);


const languages = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Bengali', 'Marathi', 'Malayalam'];
const languageToCodeMap: { [key: string]: string } = {
  'English': 'en-US',
  'Telugu': 'te-IN',
  'Hindi': 'hi-IN',
  'Tamil': 'ta-IN',
  'Kannada': 'kn-IN',
  'Bengali': 'bn-IN',
  'Marathi': 'mr-IN',
  'Malayalam': 'ml-IN',
};

const createImagePrompt = (promptId: number, userInput: string, language: string): string => {
    const suffix = `educational diagram, simple line art, with a white background and a simple chalk drawing effect.

**CRITICAL INSTRUCTION:** All text and labels MUST be written perfectly and clearly in **${language}**.
- Spelling and grammar in **${language}** must be 100% accurate.
- Use a large, bold, simple, block-letter font.
- The text must be extremely legible and easy for a child to read. This is the most important part of the image.`;
    
    let basePrompt = '';

    switch (promptId) {
        case 1:
            basePrompt = `A simple 3-panel storyboard for a children's moral story about "${userInput}". Use stick figures and basic shapes.`;
            break;
        case 2:
            basePrompt = `A visual matching exercise for a children's worksheet based on a story about "${userInput}". Column A has simple drawings of 3-4 key elements. Column B has their names.`;
            break;
        case 3:
            basePrompt = `A very simple, labeled diagram of the concept "${userInput}", suitable for a children's classroom. Use simple icons and clear arrows to explain the process.`;
            break;
        case 4:
            basePrompt = `A simple diagram of "${userInput}" for a classroom. Use clear labels and arrows if needed.`;
            break;
        default:
            basePrompt = `A simple educational diagram about "${userInput}".`;
            break;
    }
    return `${basePrompt} ${suffix}`;
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, persistedState, onStateChange, onAddToHistory }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isSavingPdf, setIsSavingPdf] = useState<boolean>(false);
  const downloadableContentRef = useRef<HTMLDivElement>(null);
  
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const { 
    inputValue = prompt.defaultInput || '', 
    secondaryInputValue = '',
    language = languages[0],
    questionCount = persistedState.questionCount ?? prompt.defaultQuestionCount ?? 5,
    markdownOutput = '',
    imageUrl = null,
    imageError = null,
    inputImage = null,
    inputAudio = null,
    youtubeSuggestions = null,
  } = persistedState;
  
  const isAnyLoading = isLoading || isImageLoading;
  const hasOutput = isLoading || isImageLoading || error || markdownOutput || imageUrl || imageError;

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`; // Reduced max height
    }
  }, [inputValue]);

  useEffect(() => {
    if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
    setIsImageLoading(false);
    setError(null);
    setIsCopied(false);
  }, [prompt.id]);

  useEffect(() => {
    if (inputAudio?.data && !inputAudio.url) {
        try {
            const byteString = atob(inputAudio.data);
            const mimeString = inputAudio.type;
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const url = URL.createObjectURL(blob);
            onStateChange({ inputAudio: { ...inputAudio, url } });
        } catch (e) {
            console.error("Failed to reconstruct audio URL from base64 data", e);
            onStateChange({ inputAudio: null });
        }
    }

    const currentAudioUrl = inputAudio?.url;
    return () => {
        if (currentAudioUrl) {
            URL.revokeObjectURL(currentAudioUrl);
        }
    };
  }, [inputAudio, onStateChange]);
  
  useEffect(() => {
    const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
            setVoices(availableVoices);
        }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (window.speechSynthesis?.speaking) {
            window.speechSynthesis.cancel();
        }
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { 
        setError("Image size cannot exceed 4MB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onStateChange({
            inputImage: {
                type: file.type,
                data: base64String,
            }
        });
    };
    reader.onerror = () => {
        setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onStateChange({ inputImage: null });
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleStartRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1];
          onStateChange({
            inputAudio: {
              type: audioBlob.type,
              data: base64Data,
              url: audioUrl,
            },
          });
          audioChunksRef.current = [];
        };
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please ensure permission is granted and try again.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRemoveAudio = () => {
    onStateChange({ inputAudio: null });
  };


  const handleAction = useCallback(async () => {
    setError(null);
    onStateChange({ markdownOutput: '', imageUrl: null, imageError: null, youtubeSuggestions: null });
    setIsLoading(true);
    if (prompt.generatesVisualAid) {
      setIsImageLoading(true);
    }

    let finalPrompt = prompt.promptTemplate!;
    if (prompt.inputLabel) {
      if (!inputValue.trim() && !inputImage && !inputAudio) {
        setError('Please provide a text input, upload an image, or record audio.');
        setIsLoading(false);
        setIsImageLoading(false);
        return;
      }
      const mainInput = inputValue.trim() || (inputAudio ? "The main content for this prompt is provided in the attached audio file." : '');
      finalPrompt = finalPrompt.replace('{{input}}', mainInput);
    }
    
    if (prompt.secondaryInputLabel) {
      if (!secondaryInputValue.trim()) {
        setError(`Please provide a value for "${prompt.secondaryInputLabel}".`);
        setIsLoading(false);
        setIsImageLoading(false);
        return;
      }
      finalPrompt = finalPrompt.replace('{{secondary_input}}', secondaryInputValue);
    }

    if (prompt.questionCountLabel) {
        finalPrompt = finalPrompt.replace(/\{\{question_count\}\}/g, String(questionCount));
    }

    if (prompt.showLanguageSelector) {
        finalPrompt = finalPrompt.replace(/\{\{language\}\}/g, language);
    }

    try {
      const stream = generateContentStream(finalPrompt, inputImage, inputAudio, prompt.lowLatency);
      let mainContent = "";
      for await (const chunk of stream) {
        mainContent += chunk;
        onStateChange({ markdownOutput: mainContent }); 
      }
      
      let finalSuggestions = null;
      let finalImageUrl = null;
      let finalImageError = null;

      // After main content is generated, fetch related assets if needed.
      // Run YouTube search and Image generation in parallel for speed.
      const assetPromises = [];

      if (prompt.suggestsYouTube && inputValue.trim()) {
        assetPromises.push(
          (async () => {
            try {
              const langCode = languageToCodeMap[language]?.split('-')[0] || 'en';
              finalSuggestions = await searchYouTube(inputValue, langCode);
            } catch (e: any) {
              console.error("Failed to fetch YouTube suggestions:", e);
              // Do not block UI, just log the error. We can optionally show a small error notice.
              setError(prev => prev ? `${prev}\nCould not load video suggestions.` : 'Could not load video suggestions.');
            }
          })()
        );
      }
      
      if (prompt.generatesVisualAid && inputValue.trim()) {
        assetPromises.push(
          (async () => {
            try {
              const imagePrompt = createImagePrompt(prompt.id, inputValue, language);
              finalImageUrl = await generateImage(imagePrompt);
            } catch (e: any) {
              finalImageError = e.message || "An unknown error occurred.";
            }
          })()
        );
      }

      // Wait for all asset fetches to complete
      await Promise.all(assetPromises);

      onStateChange({ 
        markdownOutput: mainContent, 
        youtubeSuggestions: finalSuggestions,
        imageUrl: finalImageUrl,
        imageError: finalImageError
      });

      onAddToHistory({
        userInput: inputValue,
        secondaryUserInput: prompt.secondaryInputLabel ? secondaryInputValue : undefined,
        response: mainContent,
        imageUrl: finalImageUrl,
        youtubeSuggestions: finalSuggestions
      });


    } catch (e: any) {
      const offlineMessage = "You are currently offline. Could not connect to the AI service.";
      const generalMessage = e.message || 'An unexpected error occurred.';
      const errorMessage = !navigator.onLine ? offlineMessage : generalMessage;

      setError(errorMessage);
      onStateChange({ markdownOutput: '', imageError: errorMessage });
    } finally {
      setIsLoading(false);
      setIsImageLoading(false);
    }
  }, [prompt, inputValue, secondaryInputValue, language, questionCount, onStateChange, onAddToHistory, inputImage, inputAudio]);

  const outputHtml = useMemo(() => {
    if (!markdownOutput) return "";
    const dirtyHtml = marked.parse(markdownOutput);
    return DOMPurify.sanitize(dirtyHtml as string);
  }, [markdownOutput]);

  const handleCopy = useCallback(() => {
    if (!markdownOutput) return;
    navigator.clipboard.writeText(markdownOutput).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, [markdownOutput]);
  
  const handleToggleSpeech = useCallback(() => {
    if (!window.speechSynthesis || !markdownOutput) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    if (voices.length === 0) {
        setError("Speech synthesis voices are still loading. Please try again in a moment.");
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = outputHtml;
    const textToSpeak = tempDiv.textContent || tempDiv.innerText || markdownOutput;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    const targetLang = languageToCodeMap[language] || 'en-US';
    
    let voice = voices.find(v => v.lang === targetLang);
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    }

    if (voice) {
        utterance.voice = voice;
    } else {
        console.warn(`No voice found for language: ${language} (lang code: ${targetLang}). Using browser default.`);
        utterance.lang = targetLang;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error('SpeechSynthesisUtterance.onerror', `Error: ${event.error}`, event);
      
      let userMessage = `Could not play audio for ${language}.`;
      switch(event.error) {
          case 'not-allowed':
              userMessage = "Speech playback is not allowed. Please check your browser's autoplay or site permissions settings.";
              break;
          case 'language-unavailable':
              userMessage = `The selected language (${language}) is not supported for speech by your browser.`;
              break;
          case 'voice-unavailable':
              userMessage = `A suitable voice for ${language} is currently unavailable on your device.`;
              break;
          case 'synthesis-failed':
              userMessage = "An unexpected error occurred during speech synthesis. Please try again.";
              break;
          case 'network':
              userMessage = "A network error prevented speech generation. Please check your internet connection.";
              break;
          case 'audio-busy':
              userMessage = "The audio output is currently busy. Please try again in a moment.";
              break;
          default:
              userMessage = `Could not play audio. Your browser may not support this feature. (Error: ${event.error})`;
              break;
      }

      setError(userMessage);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);

  }, [isSpeaking, markdownOutput, outputHtml, language, voices]);

  const handleDownloadPdf = useCallback(async () => {
    const contentToCapture = downloadableContentRef.current;
    if (!contentToCapture) {
      setError("Could not find content to download. Please try again.");
      return;
    }

    setIsSavingPdf(true);
    setError(null);

    try {
      const canvas = await html2canvas(contentToCapture, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a', 
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      const ratio = pdfWidth / imgWidth;
      const pdfImgHeight = imgHeight * ratio;

      let position = 0;
      let heightLeft = pdfImgHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${prompt.title.replace(/[\s/]/g, '_')}_sahayak.pdf`);

    } catch (e: any) {
      console.error("Failed to generate PDF:", e);
      setError("Sorry, we couldn't create the PDF. This can happen with complex content. Please try copying the text instead.");
    } finally {
      setIsSavingPdf(false);
    }
  }, [prompt.title]);
  
  return (
    <div className="flex flex-col h-full bg-transparent">
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {prompt.secondaryInputLabel && (
                <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-lg p-6 mb-6">
                    <label htmlFor="secondary-prompt-input" className="block text-lg font-orbitron text-cyan-300 mb-2">
                        {prompt.secondaryInputLabel}
                    </label>
                    <input
                        id="secondary-prompt-input"
                        type="text"
                        value={secondaryInputValue}
                        onChange={(e) => onStateChange({ secondaryInputValue: e.target.value })}
                        placeholder={prompt.secondaryInputPlaceholder}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 placeholder-purple-300/30 font-mono"
                        disabled={isAnyLoading}
                    />
                </div>
            )}
            {prompt.id === 0 && (
                <div className="text-sm text-purple-300 mb-6 bg-black/30 p-4 rounded-xl border border-purple-500/30 font-mono">
                    <p><strong className="text-cyan-400 font-bold font-orbitron">💡 HINT:</strong> Try asking things like "Explain the Water Cycle", "Give me a quiz on Nouns", or "Ideas for a history project on the Indus Valley Civilization".</p>
                </div>
            )}

            {hasOutput ? (
                 <div ref={downloadableContentRef} className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-lg p-6 min-h-[200px]" aria-live="polite">
                    {error && !isLoading && (
                        <div className="p-4 bg-pink-900/50 border border-pink-700 text-pink-300 rounded-md mb-4">
                        <p className="font-orbitron"><strong>SYSTEM ERROR:</strong> {error}</p>
                        </div>
                    )}
                    {(isLoading || markdownOutput) && (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-orbitron text-cyan-300">
                                    {prompt.id === 12 ? 'Generated Image Prompt' : 'AI Response'}
                                </h3>
                                {outputHtml && !isLoading && (
                                <div className="flex items-center space-x-2">
                                    {prompt.canSynthesizeSpeech && (
                                        <button
                                        onClick={handleToggleSpeech}
                                        className="flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-md text-xs text-purple-300 hover:text-white transition-colors duration-200"
                                        aria-label={isSpeaking ? "Stop listening" : "Listen to the result"}
                                        >
                                        {isSpeaking ? <StopCircleIcon className="h-4 w-4 text-pink-400" /> : <PlayCircleIcon className="h-4 w-4" />}
                                        <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                                        </button>
                                    )}
                                    <button 
                                    onClick={handleCopy} 
                                    className="flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-md text-xs text-purple-300 hover:text-white transition-colors duration-200"
                                    aria-label="Copy to clipboard"
                                    >
                                    {isCopied ? <CheckIcon className="h-4 w-4 text-cyan-400" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
                                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                    <button
                                            onClick={handleDownloadPdf}
                                            disabled={isSavingPdf}
                                            className="flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 rounded-md text-xs text-purple-300 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
                                            aria-label="Download as PDF"
                                        >
                                            {isSavingPdf ? (
                                                <>
                                                    <TextLoadingSpinner />
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                                    <span>PDF</span>
                                                </>
                                            )}
                                        </button>
                                </div>
                                )}
                            </div>
                            
                            <div>
                                <div className="w-full">
                                    {isLoading && !markdownOutput && (
                                    <div className="flex items-center justify-center h-full pt-8">
                                        <TextLoadingSpinner /> <span className="ml-2 text-gray-400 font-mono">Generating...</span>
                                    </div>
                                    )}
                                    {outputHtml && (
                                    <>
                                        <div
                                            className="prose-styling max-w-none prose-p:my-1 rounded-md p-4"
                                            dangerouslySetInnerHTML={{ __html: outputHtml }}
                                        />
                                        {prompt.id === 12 && !isLoading && markdownOutput && (
                                            <div className="mt-4 flex justify-end">
                                                <a
                                                    href={`https://www.bing.com/images/create?q=${encodeURIComponent(markdownOutput)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/30 transform hover:scale-105 inline-flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Create with Bing Image Creator
                                                </a>
                                            </div>
                                        )}
                                    </>
                                    )}
                                </div>

                                {youtubeSuggestions && youtubeSuggestions.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-purple-500/30">
                                    <h3 className="text-lg font-orbitron text-cyan-300 mb-3 flex items-center gap-2">
                                        <VideoCameraIcon className="h-5 w-5" />
                                        Suggested Videos
                                    </h3>
                                    <div className="space-y-3">
                                        {youtubeSuggestions.map((video, index) => (
                                        <a
                                            key={index}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block p-3 bg-black/20 rounded-lg hover:bg-purple-900/40 border border-purple-500/30 hover:border-cyan-400/50 transition-all group"
                                        >
                                            <p className="font-semibold text-cyan-400 text-sm group-hover:underline">{video.title}</p>
                                            <p className="text-xs text-purple-300/70 truncate mt-1 font-mono">{video.url}</p>
                                        </a>
                                        ))}
                                    </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {prompt.generatesVisualAid && (isImageLoading || imageUrl || imageError) && (
                        <div className="mt-6 pt-6 border-t border-purple-500/30">
                            <h3 className="text-lg font-orbitron text-cyan-300 mb-3">
                              Suggested Visual Aid
                            </h3>
                            <div className="bg-black/20 rounded-lg p-4 border border-purple-500/30 min-h-[300px] flex items-center justify-center">
                            {isImageLoading && <ImageLoadingSpinner />}
                            {imageError && !isImageLoading && <ImageError message={imageError} />}
                            {imageUrl && !isImageLoading && !imageError && (
                                <img src={imageUrl} alt="Generated visual aid" className="max-w-full h-auto rounded-md object-contain" />
                            )}
                            </div>
                        </div>
                    )}
                 </div>
            ) : (
                <div className="text-center text-gray-500 pt-10 font-mono">
                    <p className="text-xl text-purple-400 font-orbitron animate-pulse">Awaiting Input...</p>
                    <p>Enter a prompt below to get started.</p>
                </div>
            )}
        </div>
      </main>
      <footer className="flex-shrink-0 bg-black/30 backdrop-blur-md border-t border-purple-500/30 p-2">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-1">
                 {prompt.showLanguageSelector && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="language-select" className="text-xs font-semibold text-purple-300 font-orbitron">
                        Language:
                      </label>
                      <select
                        id="language-select"
                        value={language}
                        onChange={(e) => onStateChange({ language: e.target.value })}
                        className="px-2 py-1 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-cyan-300 text-xs font-mono"
                        disabled={isAnyLoading}
                      >
                        {languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {prompt.questionCountLabel && (
                    <div className="flex items-center gap-2">
                      <label htmlFor="question-count-input" className="text-xs font-semibold text-purple-300 font-orbitron">
                        {prompt.questionCountLabel}:
                      </label>
                      <input
                        id="question-count-input"
                        type="number"
                        value={questionCount}
                        onChange={(e) => onStateChange({ questionCount: parseInt(e.target.value, 10) || 1 })}
                        min="1"
                        max="50"
                        className="w-20 px-2 py-1 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-cyan-300 text-xs font-mono"
                        disabled={isAnyLoading}
                      />
                    </div>
                  )}
            </div>

            {inputImage && (
                <div className="relative group inline-block mb-2 ml-2">
                    <img src={`data:${inputImage.type};base64,${inputImage.data}`} alt="Input preview" className="rounded-md h-16 w-16 object-cover border-2 border-purple-500/50"/>
                    <button onClick={handleRemoveImage} className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full text-white hover:bg-pink-500 p-0.5" aria-label="Remove image" disabled={isAnyLoading}><XCircleIcon className="h-5 w-5" /></button>
                </div>
            )}
            {inputAudio && !isRecording && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-black/30 rounded-lg">
                    <audio src={inputAudio.url} controls className="flex-grow w-full h-8" />
                    <button onClick={handleRemoveAudio} className="p-1 text-gray-400 hover:text-white disabled:opacity-50" aria-label="Remove audio" disabled={isAnyLoading}><XCircleIcon className="h-5 w-5" /></button>
                </div>
            )}
             {error && isAnyLoading && (
                <div className="p-3 bg-pink-900/50 border border-pink-700 text-pink-300 rounded-md mb-2 text-sm font-mono">
                  <p><strong>ERROR:</strong> {error}</p>
                </div>
             )}


            <div className="bg-black/50 border border-purple-500/50 rounded-xl p-2 flex items-end gap-2 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400 transition-all">
                <textarea
                    ref={textareaRef}
                    id="prompt-input"
                    value={inputValue}
                    onChange={(e) => onStateChange({ inputValue: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if(!isAnyLoading) handleAction(); } }}
                    placeholder={prompt.inputPlaceholder || "Enter your message..."}
                    className="flex-1 bg-transparent resize-none p-2 text-gray-200 focus:outline-none placeholder-purple-300/40 font-mono"
                    rows={1}
                    style={{maxHeight: '8rem'}}
                    disabled={isAnyLoading}
                />
                
                <div className="flex items-center self-end gap-1">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/png, image/jpeg, image/webp" className="hidden" disabled={isAnyLoading} />
                    
                    {prompt.showImageInput && (
                        <button onClick={() => fileInputRef.current?.click()} disabled={isAnyLoading} className="p-2 text-purple-300 hover:text-cyan-300 hover:bg-purple-500/20 rounded-full transition-colors disabled:opacity-50" title="Attach Image">
                            <PhotoIcon className="h-5 w-5" />
                        </button>
                    )}
                    
                    {prompt.showAudioInput && (
                        !isRecording ? (
                            <button onClick={handleStartRecording} disabled={isAnyLoading} className="p-2 text-purple-300 hover:text-cyan-300 hover:bg-purple-500/20 rounded-full transition-colors disabled:opacity-50" title="Record Audio">
                                <MicrophoneIcon className="h-5 w-5" />
                            </button>
                        ) : (
                            <button onClick={handleStopRecording} className="p-2 text-pink-500 bg-pink-900/50 rounded-full animate-pulse" title="Stop Recording">
                                <StopCircleIcon className="h-5 w-5" />
                            </button>
                        )
                    )}
                    
                    <button onClick={handleAction} disabled={isAnyLoading || (!inputValue.trim() && !inputImage && !inputAudio)} className="p-2 rounded-full transition-colors bg-cyan-600 text-white disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-cyan-500 shadow-lg shadow-cyan-500/30" title="Generate Response">
                         {isAnyLoading ? <TextLoadingSpinner /> : <PaperAirplaneIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};