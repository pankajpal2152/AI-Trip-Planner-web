import { db } from 'service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';
import Footer from '../view-trip/components/Footer';

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        const getUserTrips = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.email) {
                navigate('/');
                return;
            }
            try {
                const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
                const querySnapshot = await getDocs(q);
                const trips = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserTrips(trips);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };

        getUserTrips();
    }, [navigate]);

    return (
        <>
            <div className="px-5 mt-10 sm:px-10 md:px-32 lg:px-56 xl:px-72">
                <h2 className="text-3xl font-bold">My Trips</h2>

                <div className="grid grid-cols-2 gap-5 mt-10 md:grid-cols-3">
                    {userTrips.length > 0 ? (
                        userTrips.map((trip) => <UserTripCardItem key={trip.id} trip={trip} />)
                    ) : (
                        <p className="col-span-full text-center text-gray-400">No trips found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MyTrips;
