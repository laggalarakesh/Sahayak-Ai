
import React, { useState, useEffect } from 'react';
import { updateProfile } from "@firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { UserCircleIcon } from './icons.tsx';
import { auth, db } from '../services/firebase.ts';
import type { UserProfile } from '../types.ts';

interface ProfileProps {
    user: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Reset name in form if user prop changes or name is updated successfully
        setDisplayName(user.displayName || '');
    }, [user.displayName]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user.displayName === displayName) {
            setIsEditing(false);
            return;
        }

        if (!displayName.trim()) {
            setError('Full Name cannot be empty.');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            // Update Auth profile
            if (!auth.currentUser) throw new Error("User not authenticated.");
            await updateProfile(auth.currentUser, { displayName });

            // Update Firestore document
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                displayName: displayName
            });
            
            // The onSnapshot listener in App.tsx will automatically update the UI.
            
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent">
            <div className="max-w-4xl mx-auto">
                <div className="bg-black/50 backdrop-blur-lg border border-purple-500/30 rounded-xl shadow-[0_0_20px_theme(colors.purple.700)] p-8">
                    {message && <p className="bg-cyan-900/50 text-cyan-300 p-3 rounded-md mb-4 text-sm font-mono" role="alert">{message}</p>}
                    {error && <p className="bg-pink-900/50 text-pink-300 p-3 rounded-md mb-4 text-sm font-mono" role="alert">{error}</p>}
                    
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        {/* Personal Details Section */}
                        <div>
                            <h3 className="text-lg font-orbitron text-cyan-300 border-b border-purple-500/30 pb-2 mb-4">Personal Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-purple-300 font-orbitron">Full Name</label>
                                    <input
                                        id="displayName"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        readOnly={!isEditing}
                                        className={`mt-1 w-full p-3 bg-black/20 border border-purple-500/50 rounded-md transition text-gray-200 font-mono ${isEditing ? 'focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400' : 'cursor-default'}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-purple-300 font-orbitron">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={user.email || ''}
                                        readOnly
                                        className="mt-1 w-full p-3 bg-black/30 border border-purple-800/50 rounded-md text-gray-500 cursor-not-allowed font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Official Details Section */}
                         <div>
                            <h3 className="text-lg font-orbitron text-cyan-300 border-b border-purple-500/30 pb-2 mb-4">Official Details</h3>
                            <div className="space-y-4">
                               <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-purple-300 font-orbitron">Role</label>
                                    <input
                                        id="role"
                                        type="text"
                                        value={user.role}
                                        readOnly
                                        className="mt-1 w-full p-3 bg-black/30 border border-purple-800/50 rounded-md text-gray-500 cursor-not-allowed font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            {isEditing ? (
                                <>
                                    <button type="button" onClick={() => { setIsEditing(false); setDisplayName(user.displayName || ''); setError(''); }} className="px-6 py-2 bg-purple-900/80 text-white font-bold rounded-full hover:bg-purple-800/90 transition-all duration-200">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading || !displayName.trim()} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/30">
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/30">
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Profile;