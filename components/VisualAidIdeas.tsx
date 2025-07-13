import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService.ts';

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


const DiagramCard = ({ title, prompt, caption }: { title: string, prompt: string, caption: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            setError(null);
            setIsLoading(true);
            try {
                const url = await generateImage(prompt);
                setImageUrl(url);
            } catch (e: any) {
                setError(e.message || "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
    }, [prompt]);


    return (
        <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-orbitron text-cyan-400 mb-3">{title}</h3>
            <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20 mb-4 min-h-[300px] flex items-center justify-center">
               {isLoading && <ImageLoadingSpinner />}
               {error && <ImageError message={error} />}
               {imageUrl && !isLoading && !error && (
                   <img src={imageUrl} alt={title} className="max-w-full h-auto rounded-md object-contain" />
               )}
            </div>
            <figcaption className="text-purple-300/80 italic text-sm font-mono">
                <strong>Caption:</strong> {caption}
            </figcaption>
        </div>
    );
};

const visualAidPrompts = [
    {
        title: "1. Localized Story Content Generator – Storyboard",
        prompt: "A simple 3-panel storyboard for a children's moral story about a thirsty crow dropping pebbles into a pitcher to raise the water level. The style should be a very simple blackboard chalk drawing with stick figures and basic shapes. Add simple labels like 'Thirsty Crow', 'Pebbles', 'Water Up!'",
        caption: "This storyboard shows how the clever crow solved his problem step-by-step. Where there's a will, there's a way!"
    },
    {
        title: "2. Worksheet Generator – Matching Exercise",
        prompt: "A visual matching exercise for a children's worksheet. Column A has simple drawings of 3-4 key elements. Column B has their names. The style should be a very simple blackboard chalk drawing. Draw lines connecting the matching picture and word.",
        caption: "Match the picture in Column A with the correct word in Column B to show the life cycle of a plant."
    },
    {
        title: "3. Concept Explainer Bot – The Water Cycle",
        prompt: "A very simple, labeled diagram of the water cycle, suitable for a children's classroom blackboard. Show a simple sun, evaporation from an ocean with upward arrows, condensation into a single fluffy cloud, and precipitation as rain drops falling down. Use simple icons and clear arrows. Label the key parts: Sun, Evaporation, Condensation, Rain, Ocean. The style should be a minimalist chalk drawing on a blackboard.",
        caption: "The sun heats the water, which turns into vapor and goes up. It forms clouds, and when they get heavy, the water falls as rain. This is the water cycle!"
    },
    {
        title: "4. Visual Aid/Diagram Generator – How to Draw a Plant Cell",
        prompt: "A very simple diagram of a plant cell for a children's classroom blackboard. Draw a large rectangle with rounded corners for the 'Cell Wall'. Inside it, draw another rectangle for the 'Cell Membrane'. In the center, a circle for the 'Nucleus'. Add a few small ovals for 'Chloroplasts'. The style should be a clear, minimalist chalk drawing with easy-to-read labels.",
        caption: "Follow these simple steps to draw a plant cell on the blackboard. Each part has an important job to do!"
    }
];


const VisualAidIdeas: React.FC = () => {
    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-orbitron text-white">Visual Aid Ideas for the Blackboard</h2>
                    <p className="text-purple-300/80 mt-2 font-mono">AI-generated diagrams you can use to explain concepts to students.</p>
                </div>
                {visualAidPrompts.map(item => (
                    <DiagramCard 
                        key={item.title}
                        title={item.title}
                        caption={item.caption}
                        prompt={item.prompt}
                    />
                ))}
            </div>
        </main>
    );
};

export default VisualAidIdeas;