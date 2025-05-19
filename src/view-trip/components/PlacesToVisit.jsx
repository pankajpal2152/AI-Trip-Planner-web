// components/PlacesToVisit.jsx
import React from 'react';
import { normalizeKeys } from '../../utils/normalizeCase';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
    const normalizedTrip = normalizeKeys(trip);
    const itinerary = normalizedTrip?.tripdata?.travelplan?.itinerary || [];

    if (!itinerary.length) {
        return <div className="mt-10 text-center text-gray-500"><p>No places to visit found.</p></div>;
    }

    return (
        <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold">Places to Visit</h2>
            <div className="flex flex-col gap-6">
                {itinerary.map((item, index) => (
                    <div key={index}>
                        <h3 className="mb-2 text-lg font-semibold text-blue-700">{item.day || item.Day}</h3>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {(item.plan || item.places)?.map((place, i) => (
                                <PlaceCardItem key={i} place={place} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlacesToVisit;