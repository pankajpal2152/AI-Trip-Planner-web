// components/PlaceCardItem.jsx
import React from 'react';
import { usePlacePhoto } from '@/hooks/usePlacePhoto';

function PlaceCardItem({ place }) {
    const { photoUrl } = usePlacePhoto(place?.placename);

    const handleImageError = (e) => {
        e.target.src = '/placeholder.jpg';
    };

    const formatGeocoordinate = (geo) => (
        typeof geo === 'object' ? `${geo.latitude}, ${geo.longitude}` : geo || ''
    );

    return (
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placename || '')}`} target="_blank" rel="noopener noreferrer">
            <div className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg">
                <img src={photoUrl || '/placeholder.jpg'} alt={place?.placename} onError={handleImageError} className="object-cover w-full h-40" />
                <div className="flex flex-col gap-2 p-4">
                    <h4 className="font-semibold text-gray-800 text-md">{place?.placename}</h4>
                    <p className="text-xs text-gray-600 line-clamp-3">{place?.placedetails}</p>
                    <p className="text-sm text-gray-500">📍 {formatGeocoordinate(place?.geocoordinate)}</p>
                    <p className="text-sm text-orange-600">🕒 {place?.time || place?.timetravel || place?.timetospend}</p>
                    <p className="text-sm text-gray-600">🎟️ {place?.ticketpricing}</p>
                </div>
            </div>
        </a>
    );
}

export default PlaceCardItem;