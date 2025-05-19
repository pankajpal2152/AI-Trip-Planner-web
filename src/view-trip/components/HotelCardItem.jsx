// components/HotelCardItem.jsx
import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function HotelCardItem({ hotel, address, handleImageError, formatGeocoordinate }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        if (!hotel?.hotelname) return;
        GetPlaceDetails({ textQuery: hotel.hotelname })
            .then(resp => {
                const name = resp?.data?.places?.[0]?.photos?.[3]?.name;
                if (name) {
                    setPhotoUrl(PHOTO_REF_URL.replace('{NAME}', name));
                }
            })
            .catch(console.error);
    }, [hotel]);

    return (
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelname + ', ' + (address || ''))}`} target='_blank' rel='noopener noreferrer' className='block'>
            <div className='transition bg-white shadow rounded-xl hover:shadow-md'>
                <img
                    src={photoUrl || '/placeholder.jpg'}
                    alt={hotel.hotelname}
                    onError={(e) => handleImageError(e, hotel.hotelname)}
                    className='object-cover w-full h-40 rounded-t-xl'
                />
                <div className='flex flex-col gap-1 p-3'>
                    <h2 className='text-sm font-semibold line-clamp-2'>{hotel.hotelname}</h2>
                    <p className='text-xs text-gray-500 line-clamp-1'>📍 {address || 'Address not available'}</p>
                    {hotel.geocoordinate && <p className='text-xs text-gray-400'>🌐 {formatGeocoordinate(hotel.geocoordinate)}</p>}
                    {hotel.price && <p className='text-sm text-red-500'>💰 {hotel.price}</p>}
                    {hotel.rating && <p className='text-sm text-yellow-600'>⭐ {hotel.rating} stars</p>}
                    {hotel.description && <p className='text-xs text-gray-600 line-clamp-3'>{hotel.description}</p>}
                </div>
            </div>
        </a>
    );
}

export default HotelCardItem;