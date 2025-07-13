export interface YouTubeVideo {
    title: string;
    url: string;
}

// Key provided by the user in the previous prompt.
const YOUTUBE_API_KEY = "AIzaSyAUbvOEbKEuwnoaa-fSYo9t-xXPeC6tx0Y";

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function searchYouTube(query: string, languageCode: string, maxResults: number = 3): Promise<YouTubeVideo[]> {
    // Fail gracefully if the key is missing or a placeholder
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes("YOUR_YOUTUBE_API_KEY")) {
        console.warn("YouTube API Key is not configured. Video suggestions will be unavailable.");
        return []; 
    }

    const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: String(maxResults),
        relevanceLanguage: languageCode,
        key: YOUTUBE_API_KEY,
    });

    try {
        const response = await fetch(`${YOUTUBE_API_URL}?${params}`);
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData?.error?.message || response.statusText;
            console.error(`YouTube API Error: ${errorMessage}`, errorData);
            // Don't throw, just return empty so the UI doesn't break
            return [];
        }
        const data = await response.json();
        
        return data.items.map((item: any) => ({
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));

    } catch (error) {
        console.error("Error searching YouTube:", error);
        // Return empty on any other fetch error too
        return [];
    }
}
