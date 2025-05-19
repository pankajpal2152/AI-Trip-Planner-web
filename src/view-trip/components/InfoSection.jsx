import { Button } from 'components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from 'service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { toast } from 'sonner';
import { normalizeKeys } from '../../utils/normalizeCase';

function InfoSection({ trip }) {
    const [photoUrl, setPhotoUrl] = useState();

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

    const handleShare = async () => {
        const normTrip = normalizeKeys(trip);
        const hotels = normTrip?.tripdata?.travelplan?.hotels || [];
        const itinerary = normTrip?.tripdata?.travelplan?.itinerary || [];

        console.log('Hotels array:', hotels);
        hotels.forEach((hotel, index) => {
            console.log(`Hotel ${index + 1} name:`, hotel.name || hotel.Name);
        });

        let shareText = `Trip to ${trip?.userSelection?.location?.label}\n` +
            `Days: ${trip?.userSelection?.noOfDays}\n` +
            `Budget: ${trip?.userSelection?.budget}\n` +
            `Travelers: ${trip?.userSelection?.traveler}\n\n`;

        if (hotels.length) {
            shareText += 'Hotel Recommendations:\n';
            hotels.forEach((hotel, index) => {
                const name = hotel.name || hotel.Name || '';
                shareText += `${index + 1}. ${name}\n`;
            });
            shareText += '\n';
        }

        if (itinerary.length) {
            shareText += 'Places to Visit:\n';
            itinerary.forEach(day => {
                const dayLabel = day.day || day.Day || 'Day';
                shareText += `${dayLabel}:\n`;
                const places = day.plan || day.places || [];
                places.forEach((place, idx) => {
                    const placeName = place.name || place.Name || '';
                    shareText += `  ${idx + 1}. ${placeName}\n`;
                });
                shareText += '\n';
            });
        }

        const shareData = {
            title: 'My Trip Details',
            text: shareText,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success('Trip details shared successfully!');
            } catch {
                toast.error('Failed to share trip details.');
            }
        } else {
            toast.error('Sharing not supported on this browser.');
        }
    };

    return (
        <div>
            <img
                src={photoUrl || '/placeholder.jpg'}
                className="h-[340px] w-full object-cover rounded-xl"
                alt="Location Visual"
            />

            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 my-5">
                    <h2 className="text-2xl font-bold">{trip?.userSelection?.location?.label}</h2>
                    <div className="flex gap-5">
                        <h2 className="p-1 px-3 text-xs text-gray-500 bg-gray-200 rounded-full md:text-md">
                            📅 {trip.userSelection?.noOfDays} Day
                        </h2>
                        <h2 className="p-1 px-3 text-xs text-gray-500 bg-gray-200 rounded-full md:text-md">
                            💰 {trip.userSelection?.budget} Budget
                        </h2>
                        <h2 className="p-1 px-3 text-xs text-gray-500 bg-gray-200 rounded-full md:text-md">
                            🥂 No. of Traveler: {trip.userSelection?.traveler}
                        </h2>
                    </div>
                </div>
                <Button onClick={handleShare}>
                    <IoIosSend />
                </Button>
            </div>
        </div>
    );
}

export default InfoSection;
