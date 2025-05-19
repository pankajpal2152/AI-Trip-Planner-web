/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from 'components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from 'constants/options';
import { Button } from 'components/ui/button';
import { toast } from 'sonner';
import { Toaster } from 'components/ui/sonner';
import { generateContent } from 'service/AIModel';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader
} from 'components/ui/dialog';
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from 'service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Footer from '../view-trip/components/Footer';

function CreateTrip() {
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: () => toast.error('Google login failed.')
    });

    const OnGenerateTrip = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            return setOpenDialog(true);
        }

        const { location, budget, traveler, noOfDays } = formData;
        if (!location || !budget || !traveler || !noOfDays) {
            return toast.error("Please fill all details");
        }
        if (noOfDays > 5) {
            return toast.error("Number of days should not exceed 5");
        }

        const FINAL_PROMPT = AI_PROMPT
            .replace("{location}", location.label)
            .replace("{budget}", budget)
            .replace("{traveler}", traveler)
            .replace("{totalDays}", noOfDays)
            .replace("{totalBudget}", budget)
            .replace("{totalTraveler}", traveler);

        try {
            setLoading(true);
            const resultText = await generateContent(FINAL_PROMPT);
            setGeneratedText(resultText);
            await SaveAiTrip(resultText);
        } catch (error) {
            toast.error('Failed to generate trip plan.');
        } finally {
            setLoading(false);
        }
    };

    const SaveAiTrip = async (TripData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();
        let parsedTripData;

        try {
            parsedTripData = JSON.parse(TripData);
        } catch {
            toast.error('AI response format is invalid.');
            return;
        }

        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            TripData: parsedTripData,
            userEmail: user?.email,
            id: docId
        });

        navigate('/view-trip/' + docId);
    };

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`)
            .then((resp) => {
                localStorage.setItem('user', JSON.stringify(resp.data));
                setOpenDialog(false);
                OnGenerateTrip();
            })
            .catch(() => toast.error('Failed to get Google profile.'));
    };

    return (
        <>
            <div className='px-5 mt-10 sm:px-10 md:px-32 lg:px-56 xl:px-10'>
                <h2 className='text-3xl font-bold'>Tell us your travel preferences 🏕️🌴</h2>
                <p className='mt-3 text-xl text-gray-500'>
                    Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
                </p>

                <div className='flex flex-col gap-10 mt-20'>

                    {/* Location Input */}
                    <div>
                        <h2 className='my-3 text-xl font-medium'>What is destination of choice?</h2>
                        <GooglePlacesAutocomplete
                            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                            selectProps={{
                                place,
                                onChange: (v) => {
                                    setPlace(v);
                                    handleInputChange('location', v);
                                }
                            }}
                        />
                    </div>

                    {/* Days Input */}
                    <div>
                        <h2 className='my-3 text-xl font-medium'>How many days are you planning your trip?</h2>
                        <Input
                            placeholder='Ex. 3'
                            type="number"
                            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <h2 className='my-3 text-xl font-medium'>What is your Budget?</h2>
                        <div className='grid grid-cols-3 gap-5 mt-5'>
                            {SelectBudgetOptions.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleInputChange('budget', item.title)}
                                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${formData?.budget === item.title ? 'shadow-lg border-black' : ''}`}>
                                    <h2 className='text-4xl'>{item.icon}</h2>
                                    <h2 className='text-lg font-bold'>{item.title}</h2>
                                    <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Travelers */}
                    <div>
                        <h2 className='my-3 text-xl font-medium'>Who are you traveling with?</h2>
                        <div className='grid grid-cols-3 gap-5 mt-5'>
                            {SelectTravelesList.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleInputChange('traveler', item.people)}
                                    className={`p-4 border rounded-lg cursor-pointer hover:shadow-lg ${formData?.traveler === item.people ? 'shadow-lg border-black' : ''}`}>
                                    <h2 className='text-4xl'>{item.icon}</h2>
                                    <h2 className='text-lg font-bold'>{item.title}</h2>
                                    <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generate Trip Button */}
                <div className='flex justify-end my-10'>
                    <Button disabled={loading} onClick={OnGenerateTrip}>
                        {loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip'}
                    </Button>
                </div>

                {/* Generated Output */}
                {generatedText && (
                    <div className='p-5 mt-10 whitespace-pre-wrap border rounded-lg bg-gray-50'>
                        <h3 className='mb-3 text-2xl font-semibold'>Generated Trip Plan:</h3>
                        <p>{generatedText}</p>
                    </div>
                )}
            </div>

            {/* Toast */}
            <Toaster />

            {/* Auth Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src="/logo.svg" alt="Logo" />
                            <h2 className='text-lg font-bold mt-7'>Sign In With Google</h2>
                            <p>Sign in to continue planning your trip.</p>
                            <Button onClick={login} className="flex items-center w-full gap-4 mt-5">
                                <FcGoogle className='h-7 w-7' />
                                Sign In With Google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <Footer />
        </>
    );
}

export default CreateTrip;
