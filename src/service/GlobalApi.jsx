import axios from "axios";

// Google Places SearchText Endpoint
const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

// Axios request config with proper headers
const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
    }
};

/**
 * Fetches Google Place details using text search.
 * @param {{ textQuery: string }} data
 * @returns {Promise<AxiosResponse>} response
 */
export const GetPlaceDetails = async (data) => {
    if (!data?.textQuery || typeof data.textQuery !== 'string' || !data.textQuery.trim()) {
        throw new Error('Invalid or missing textQuery parameter.');
    }

    try {
        return await axios.post(BASE_URL, data, config);
    } catch (error) {
        console.error('Error in GetPlaceDetails:', error.response?.data || error.message);
        throw error;
    }
};

// Dynamic URL to get the photo using photo name
export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;
