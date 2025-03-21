// Function to fetch random illustrations from Lummi API
export async function fetchRandomIllustrations(count: number = 8): Promise<string[]> {
    try {
        // This is a placeholder URL - replace with the actual Lummi API endpoint
        const response = await fetch(`https://api.lummi.com/v1/illustrations/random?count=${count}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include API key if required
                // 'Authorization': 'Bearer YOUR_API_KEY',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch illustrations');
        }

        const data = await response.json();

        // This assumes the API returns an array of objects with an imageUrl property
        // Adjust according to the actual API response structure
        return data.illustrations.map((illus: any) => illus.imageUrl);
    } catch (error) {
        console.error('Error fetching illustrations:', error);

        // Fallback to placeholder images if API fails
        return Array(count).fill('').map((_, i) =>
            `https://picsum.photos/200/300?random=${i}`
        );
    }
} 