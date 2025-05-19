import { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

export function usePlacePhoto(textQuery) {
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(() => {
        if (!textQuery) return;
        const fetchPhoto = async () => {
            try {
                const response = await GetPlaceDetails({ textQuery });
                const photoName = response?.data?.places?.[0]?.photos?.[3]?.name;
                if (photoName) {
                    setPhotoUrl(PHOTO_REF_URL.replace('{NAME}', photoName));
                }
            } catch (err) {
                console.error('Photo fetch failed:', err);
            }
        };
        fetchPhoto();
    }, [textQuery]);

    return { photoUrl };
}
