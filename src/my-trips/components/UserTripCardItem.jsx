import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

    useEffect(() => {
        const locationLabel = trip?.userSelection?.location?.label?.trim();
        if (locationLabel) {
            GetPlacePhoto(locationLabel);
        }
    }, [trip]);

    const GetPlacePhoto = async (locationLabel) => {
        try {
            const result = await GetPlaceDetails({ textQuery: locationLabel });
            const photoName = result?.data?.places?.[0]?.photos?.[3]?.name;
            if (photoName) {
                const url = PHOTO_REF_URL.replace('{NAME}', photoName);
                setPhotoUrl(url);
            } else {
                console.warn('No photo found for', locationLabel);
            }
        } catch (error) {
            console.error('Place photo fetch failed:', error.message || error);
            setPhotoUrl('/placeholder.jpg');
        }
    };

    return (
        <Link to={'/view-trip/' + trip?.id}>
            <div className="overflow-hidden bg-white shadow rounded-xl hover:shadow-md transition-all duration-200">
                <img
                    src={photoUrl}
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                    alt={trip?.userSelection?.location?.label}
                    className="object-cover w-full h-40 rounded-t-xl"
                />
                <div className="p-3">
                    <h2 className="text-lg font-bold line-clamp-1">{trip?.userSelection?.location?.label}</h2>
                    <h2 className="text-sm text-gray-500 line-clamp-1">
                        {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
                    </h2>
                </div>
            </div>
        </Link>
    );
}

export default UserTripCardItem;