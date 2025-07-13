import React, { useState } from 'react';
import { AdminUsageSummarizer } from './admin/AdminUsageSummarizer.tsx';
import { AdminAboutEditor } from './admin/AdminAboutEditor.tsx';
import { AdminTeamEditor } from './admin/AdminTeamEditor.tsx';

type AdminTab = 'usage' | 'content' | 'team';

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('usage');

    const tabs: { id: AdminTab; label: string }[] = [
        { id: 'usage', label: 'Usage Summarizer' },
        { id: 'content', label: 'About Page Editor' },
        { id: 'team', label: 'Team Credits Editor' },
    ];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'usage':
                return <AdminUsageSummarizer />;
            case 'content':
                return <AdminAboutEditor />;
            case 'team':
                return <AdminTeamEditor />;
            default:
                return null;
        }
    }

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent text-gray-100">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-orbitron text-white">Admin Control Panel</h1>
                    <p className="text-purple-300/80 mt-1 font-mono">Analyze application usage data and manage site content.</p>
                </div>

                <div className="border-b border-purple-500/30 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-cyan-400 text-cyan-300 shadow-[0_1px_0_theme(colors.cyan.400)]'
                                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-orbitron text-sm transition-colors`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    {renderContent()}
                </div>
            </div>
        </main>
    );
};

export default AdminPanel;