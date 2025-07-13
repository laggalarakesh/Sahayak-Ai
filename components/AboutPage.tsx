import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../services/firebase.ts';
import type { AboutContent } from '../types.ts';
import { SparklesIcon } from './icons.tsx';

const FullPageLoader: React.FC = () => (
    <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{animationDelay: '0.2s'}}></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{animationDelay: '0.4s'}}></div>
        </div>
    </div>
);

const AboutPage: React.FC = () => {
    const [content, setContent] = useState<AboutContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        const aboutDocRef = doc(db, "siteContent", "about");
        
        const unsubscribe = onSnapshot(aboutDocRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setContent({
                        purpose: data.purpose || '',
                        useInClassrooms: data.useInClassrooms || '',
                        technologies: data.technologies || '',
                        disclaimer: data.disclaimer || '',
                        aboutAi: data.aboutAi || '',
                        features: data.features || '',
                    });
                    setError(null);
                    setInfo(null);
                } else {
                    if (!navigator.onLine) {
                        setInfo("You are currently offline. The 'About' page content will be loaded when you reconnect.");
                    } else {
                        setError("About page content has not been configured yet.");
                    }
                }
                setIsLoading(false);
            },
            (err) => {
                console.error("Error fetching about page content:", err);
                if (err.code === 'unavailable') {
                     setInfo("You are currently offline. The content for this page could not be loaded.");
                } else {
                    setError("Could not load the About page content. Please try again later.");
                }
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <FullPageLoader />;
    }

    const renderMessage = () => {
        if (info) {
            return <p className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-4 rounded-md font-mono">{info}</p>;
        }
        if (error) {
            return <p className="bg-pink-900/50 text-pink-300 p-4 rounded-md font-mono">{error}</p>;
        }
        return null;
    }

    if (!content) {
        return (
             <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent text-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    {renderMessage()}
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <SparklesIcon className="h-16 w-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-5xl font-orbitron text-white">About SahayakAI</h1>
                    <p className="mt-4 text-lg text-purple-300 font-mono">Your AI-Powered Teaching Assistant</p>
                </div>

                <div className="space-y-10">
                    <section className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-orbitron text-cyan-300 mb-4">Our Purpose</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{content.purpose}</p>
                    </section>

                    <section className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-orbitron text-cyan-300 mb-4">Use in Rural Classrooms</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{content.useInClassrooms}</p>
                    </section>
                    
                    <section className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-orbitron text-cyan-300 mb-4">About The AI</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{content.aboutAi}</p>
                    </section>

                    <section className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-orbitron text-cyan-300 mb-4">Key Features</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{content.features}</p>
                    </section>

                    <section className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-orbitron text-cyan-300 mb-4">Technology Stack</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">{content.technologies}</p>
                    </section>

                    <section className="mt-12 text-center">
                        <h2 className="text-xl font-orbitron text-yellow-400 mb-2">Disclaimer</h2>
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto whitespace-pre-wrap font-mono">{content.disclaimer}</p>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default AboutPage;