import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { generateContentStream } from '../../services/geminiService.ts';
import { ADMIN_LOG_SUMMARIZER_PROMPT } from '../../constants.tsx';

const TextLoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400" style={{animationDelay: '0.2s'}}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400" style={{animationDelay: '0.4s'}}></div>
        <span className="ml-2 text-cyan-300 font-mono">Analyzing...</span>
    </div>
);

export const AdminUsageSummarizer: React.FC = () => {
    const [logs, setLogs] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = async () => {
        if (!logs.trim()) {
            setError("Please paste some logs to summarize.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummary('');

        try {
            const prompt = ADMIN_LOG_SUMMARIZER_PROMPT.replace('{{input}}', logs);
            const stream = generateContentStream(prompt, null, null, false);
            let fullResponse = "";
            for await (const chunk of stream) {
                fullResponse += chunk;
                setSummary(fullResponse);
            }
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    const outputHtml = useMemo(() => {
        if (!summary) return "";
        const dirtyHtml = marked.parse(summary);
        return DOMPurify.sanitize(dirtyHtml as string);
    }, [summary]);

    return (
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-orbitron text-white mb-2">Usage Log Summarizer</h2>
            <p className="text-purple-300/80 mb-4 font-mono">Paste raw text logs below and the AI will generate a summary.</p>
            
            <div className="space-y-4">
                <textarea
                    value={logs}
                    onChange={(e) => setLogs(e.target.value)}
                    placeholder="Paste usage logs here..."
                    className="w-full h-64 p-3 bg-black/50 border border-purple-500/50 rounded-md focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition text-gray-200 font-mono text-sm"
                    disabled={isLoading}
                />
                
                <div className="flex justify-end">
                    <button
                        onClick={handleSummarize}
                        disabled={isLoading || !logs.trim()}
                        className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/30"
                    >
                        {isLoading ? <TextLoadingSpinner /> : '✨ Summarize Logs'}
                    </button>
                </div>
            </div>

            {(isLoading || error || summary) && (
                <div className="mt-6 pt-6 border-t border-purple-500/30">
                    <h3 className="text-lg font-orbitron text-gray-200 mb-3">Analysis Result</h3>
                    {error && (
                        <div className="p-4 bg-pink-900/50 border border-pink-700 text-pink-300 rounded-md font-mono">
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                    {isLoading && !summary && <TextLoadingSpinner />}
                    {summary && (
                         <div
                            className="prose-styling max-w-none rounded-md p-4"
                            dangerouslySetInnerHTML={{ __html: outputHtml }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};