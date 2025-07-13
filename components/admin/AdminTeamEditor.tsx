import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../../services/firebase.ts';
import type { TeamMember } from '../../types.ts';
import { PlusIcon, PencilIcon, TrashIcon, UserCircleIcon } from '../icons.tsx';

export const AdminTeamEditor: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const [isAdding, setIsAdding] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('');

    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editingMemberName, setEditingMemberName] = useState('');
    const [editingMemberRole, setEditingMemberRole] = useState('');

    const aboutDocRef = doc(db, "siteContent", "about");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInfo(null);
        try {
            const docSnap = await getDoc(aboutDocRef);
            if (docSnap.exists()) {
                setTeam(docSnap.data().team || []);
            }
        } catch (e: any) {
            if (e.code === 'unavailable') {
                console.log("Offline mode detected. No cached team data found. Displaying empty editor as expected.");
                setInfo("You are currently offline. Team data could not be loaded from the server, but you can still make and save edits. Your changes will be synced automatically when you reconnect.");
            } else {
                console.error("Error fetching team members:", e);
                setError("Failed to load team members.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [aboutDocRef]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveChanges = async (updatedTeam: TeamMember[]): Promise<boolean> => {
        setIsSaving(true);
        setError(null);
        setInfo(null);
        try {
            await setDoc(aboutDocRef, { team: updatedTeam }, { merge: true });
            setTeam(updatedTeam);
            return true;
        } catch (e: any) {
            console.error("Failed to save team changes:", e);
            setError("Failed to save changes. Please try again.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleAddMember = async () => {
        if (!newMemberName.trim() || !newMemberRole.trim()) {
            setError("Name and role cannot be empty.");
            return;
        }
        const newMember: TeamMember = {
            id: Date.now().toString(),
            name: newMemberName.trim(),
            role: newMemberRole.trim(),
        };
        const success = await handleSaveChanges([ ...team, newMember ]);
        if (success) {
            setNewMemberName('');
            setNewMemberRole('');
            setIsAdding(false);
            setError(null);
        }
    };

    const handleDeleteMember = (id: string) => {
        const updatedTeam = team.filter(member => member.id !== id);
        handleSaveChanges(updatedTeam);
    };

    const handleStartEdit = (member: TeamMember) => {
        setError(null);
        setEditingMemberId(member.id);
        setEditingMemberName(member.name);
        setEditingMemberRole(member.role);
    };

    const handleCancelEdit = () => {
        setEditingMemberId(null);
        setEditingMemberName('');
        setEditingMemberRole('');
    };

    const handleUpdateMember = async () => {
        if (!editingMemberName.trim() || !editingMemberRole.trim()) {
            setError("Name and role cannot be empty.");
            return;
        }
        const updatedTeam = team.map(member => 
            member.id === editingMemberId 
            ? { ...member, name: editingMemberName.trim(), role: editingMemberRole.trim() } 
            : member
        );
        const success = await handleSaveChanges(updatedTeam);
        if (success) {
            handleCancelEdit();
            setError(null);
        }
    };
    

    if (isLoading) {
        return <div className="text-center p-8 text-purple-300 font-mono">Loading team editor...</div>;
    }

    return (
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-orbitron text-white mb-2">Team Credits Editor</h2>
            <p className="text-purple-300/80 mb-6 font-mono">Add or edit team members displayed on the "About" page.</p>
            
            {info && <p className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 p-3 rounded-md mb-4 text-sm font-mono" role="alert">{info}</p>}
            {error && <p className="bg-pink-900/50 text-pink-300 p-3 rounded-md mb-4 text-sm font-mono" role="alert">{error}</p>}
            
            <div className="space-y-4">
                {team.map(member => (
                    <div key={member.id} className="bg-black/40 p-4 rounded-lg flex items-center justify-between border border-purple-500/20">
                        {editingMemberId === member.id ? (
                            <div className="flex-grow space-y-2">
                                <input type="text" value={editingMemberName} onChange={e => setEditingMemberName(e.target.value)} className="w-full p-2 bg-black/50 border border-purple-500/50 rounded-md text-white font-mono focus:ring-2 focus:ring-cyan-400" placeholder="Name"/>
                                <input type="text" value={editingMemberRole} onChange={e => setEditingMemberRole(e.target.value)} className="w-full p-2 bg-black/50 border border-purple-500/50 rounded-md text-white font-mono focus:ring-2 focus:ring-cyan-400" placeholder="Role"/>
                                <div className="flex justify-end space-x-2 pt-2">
                                    <button onClick={handleCancelEdit} className="px-3 py-1 text-xs bg-purple-900/80 rounded-md hover:bg-purple-800/90">Cancel</button>
                                    <button onClick={handleUpdateMember} disabled={isSaving} className="px-3 py-1 text-xs bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center space-x-4">
                                    <UserCircleIcon className="h-10 w-10 text-purple-400" />
                                    <div>
                                        <p className="font-bold text-white">{member.name}</p>
                                        <p className="text-sm text-cyan-400">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleStartEdit(member)} className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-full" aria-label={`Edit ${member.name}`}>
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteMember(member.id)} disabled={isSaving} className="p-2 text-purple-300 hover:text-pink-400 hover:bg-purple-500/20 rounded-full disabled:opacity-50" aria-label={`Delete ${member.name}`}>
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-purple-500/30">
                {isAdding ? (
                     <div className="bg-black/40 border border-purple-500/20 p-4 rounded-lg space-y-3">
                         <h3 className="text-lg font-orbitron text-white">Add New Member</h3>
                         <input type="text" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Full Name" className="w-full p-2 bg-black/50 border border-purple-500/50 rounded-md text-white font-mono focus:ring-2 focus:ring-cyan-400"/>
                         <input type="text" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} placeholder="Role (e.g., Lead Developer)" className="w-full p-2 bg-black/50 border border-purple-500/50 rounded-md text-white font-mono focus:ring-2 focus:ring-cyan-400"/>
                         <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsAdding(false)} className="px-4 py-2 bg-purple-900/80 text-white font-bold rounded-full hover:bg-purple-800/90 text-sm">Cancel</button>
                            <button onClick={handleAddMember} disabled={isSaving} className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 disabled:opacity-50 text-sm">{isSaving ? 'Saving...' : 'Add Member'}</button>
                         </div>
                     </div>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg text-white font-semibold transition-colors border border-purple-500/30 hover:border-cyan-400/50"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Team Member</span>
                    </button>
                )}
            </div>
        </div>
    );
};