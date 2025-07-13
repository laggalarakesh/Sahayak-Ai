import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../services/firebase.ts';
import type { TeamMember } from '../types.ts';
import { UserCircleIcon, UsersIcon } from './icons.tsx';

const FullPageLoader: React.FC = () => (
    <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{animationDelay: '0.2s'}}></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-cyan-500/80 shadow-[0_0_20px_theme(colors.cyan.400)]" style={{animationDelay: '0.4s'}}></div>
        </div>
    </div>
);

const CreditsPage: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    useEffect(() => {
        const aboutDocRef = doc(db, "siteContent", "about");
        
        const unsubscribe = onSnapshot(aboutDocRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    setTeam(docSnap.data().team || []);
                    setError(null);
                    setInfo(null);
                } else {
                     if (!navigator.onLine) {
                        setInfo("You are currently offline. The credits will be loaded when you reconnect.");
                    } else {
                        setError("Credits have not been configured yet.");
                    }
                }
                setIsLoading(false);
            },
            (err) => {
                console.error("Error fetching team credits:", err);
                if (err.code === 'unavailable') {
                     setInfo("You are currently offline. The content for this page could not be loaded.");
                } else {
                    setError("Could not load the credits. Please try again later.");
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

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <UsersIcon className="h-16 w-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-5xl font-orbitron text-white">Our Team & Credits</h1>
                    <p className="mt-4 text-lg text-purple-300 font-mono">The people who made SahayakAI possible.</p>
                </div>
                
                {team.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div key={member.id} className="text-center p-6 bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_20px_theme(colors.purple.500)]">
                                <UserCircleIcon className="h-24 w-24 text-purple-400 mx-auto mb-4" />
                                <h3 className="font-bold text-white text-xl">{member.name}</h3>
                                <p className="text-cyan-400 text-md">{member.role}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        {renderMessage() || <p className="font-mono">No team members have been added yet.</p>}
                    </div>
                )}
            </div>
        </main>
    );
};

export default CreditsPage;