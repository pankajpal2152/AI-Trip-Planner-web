import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { normalizeKeys } from '../../utils/normalizeCase';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAddress = (hotel) => {
        const key = Object.keys(hotel).find(k => k.toLowerCase().includes('address'));
        return key ? hotel[key] : null;
    };

    const handleImageError = (e, name) => {
        e.target.src = '/placeholder.jpg';
        toast.warning(`Image failed to load for ${name}`);
    };

    const formatGeocoordinate = (geo) => {
        if (typeof geo === 'object' && geo.latitude && geo.longitude) {
            return `${geo.latitude}, ${geo.longitude}`;
        }
        return geo || '';
    };

    useEffect(() => {
        const norm = normalizeKeys(trip);
        setHotels(norm?.tripdata?.travelplan?.hotels || []);
        setLoading(false);
    }, [trip]);

    if (loading) {
        return <p className='mt-10 text-center'>Loading hotels...</p>;
    }
    if (!hotels.length) {
        return <p className='mt-10 text-center text-gray-500'>No hotel recommendations found.</p>;
    }

    return (
        <div>
            <h2 className='mt-10 mb-4 text-xl font-bold'>Hotel Recommendations</h2>
            <div className='grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4'>
                {hotels.map((hotel, index) => (
                    <HotelCardItem
                        key={index}
                        hotel={hotel}
                        address={getAddress(hotel)}
                        handleImageError={handleImageError}
                        formatGeocoordinate={formatGeocoordinate}
                    />
                ))}
            </div>
        </div>
    );
}

export default Hotels;
