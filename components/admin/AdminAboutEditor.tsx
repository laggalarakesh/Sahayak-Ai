import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../services/firebase.ts';
import type { AboutContent } from '../../types.ts';

export const AdminAboutEditor: React.FC = () => {
    const [content, setContent] = useState<AboutContent>({
        purpose: '',
        useInClassrooms: '',
        aboutAi: '',
        features: '',
        technologies: '',
        disclaimer: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const aboutDocRef = doc(db, "siteContent", "about");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInfo(null);
        try {
            const docSnap = await getDoc(aboutDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setContent({
                    purpose: data.purpose || '',
                    useInClassrooms: data.useInClassrooms || '',
                    aboutAi: data.aboutAi || '',
                    features: data.features || '',
                    technologies: data.technologies || '',
                    disclaimer: data.disclaimer || '',
                });
            } else {
                console.log("No 'about' content document found, starting with a fresh slate.");
                if (!navigator.onLine) {
                   setInfo("You are offline and this content has not been saved locally yet. You can create new content which will sync when you are back online.");
                }
            }
        } catch (e: any) {
            if (e.code === 'unavailable') {
                console.log("Offline mode detected. No cached 'about' content found. Displaying empty editor as expected.");
                setInfo("You are currently offline. Content could not be loaded from the server, but you can still make and save edits. Your changes will be synced automatically when you reconnect.");
            } else {
                console.error("Error fetching 'about' content:", e);
                setError("Failed to load content. Please check your connection and try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [aboutDocRef]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setMessage(null);
        setInfo(null);
        try {
            await setDoc(aboutDocRef, content, { merge: true });
            setMessage("Content saved successfully!");
            setTimeout(() => setMessage(null), 3000);
        } catch (e: any) {
            console.error("Error saving 'about' content:", e);
            setError("Failed to save content. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return <div className="text-center p-8 text-purple-300 font-mono">Loading content editor...</div>;
    }
    
    return (
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-orbitron text-white mb-2">About Page Content Editor</h2>
            <p className="text-purple-300/80 mb-6 font-mono">Update the text displayed on the public "About" page. Changes will be live immediately after saving.</p>

            {info && <p className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-3 rounded-md mb-4 text-sm font-mono">{info}</p>}
            {error && <p className="bg-pink-900/50 text-pink-300 p-3 rounded-md mb-4 text-sm font-mono">{error}</p>}
            {message && <p className="bg-cyan-900/50 text-cyan-300 p-3 rounded-md mb-4 text-sm font-mono">{message}</p>}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-purple-300 mb-1 font-orbitron">Purpose</label>
                    <textarea
                        id="purpose"
                        name="purpose"
                        value={content.purpose}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                    />
                </div>
                <div>
                    <label htmlFor="useInClassrooms" className="block text-sm font-medium text-purple-300 mb-1 font-orbitron">Use in Rural Classrooms</label>
                    <textarea
                        id="useInClassrooms"
                        name="useInClassrooms"
                        value={content.useInClassrooms}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                    />
                </div>
                 <div>
                    <label htmlFor="aboutAi" className="block text-sm font-medium text-purple-300 mb-1 font-orbitron">About The AI</label>
                    <textarea
                        id="aboutAi"
                        name="aboutAi"
                        value={content.aboutAi}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                        placeholder="Detailed explanation of the AI's capabilities and purpose..."
                    />
                </div>
                <div>
                    <label htmlFor="features" className="block text-sm font-medium text-purple-300 mb-1 font-orbitron">Application Features</label>
                    <textarea
                        id="features"
                        name="features"
                        value={content.features}
                        onChange={handleChange}
                        rows={6}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                        placeholder="List the key features of the application, one per line..."
                    />
                </div>
                <div>
                    <label htmlFor="technologies" className="block text-sm font-medium text-purple-300 mb-1 font-orbitron">Technologies Used</label>
                    <textarea
                        id="technologies"
                        name="technologies"
                        value={content.technologies}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                    />
                </div>
                <div>
                    <label htmlFor="disclaimer" className="block text-sm font-medium text-purple-300 mb-1 font-orbitron">Disclaimer</label>
                    <textarea
                        id="disclaimer"
                        name="disclaimer"
                        value={content.disclaimer}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono"
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/30"
                    >
                        {isSaving ? 'Saving...' : 'Save Content'}
                    </button>
                </div>
            </form>
        </div>
    );
};