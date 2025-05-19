import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'components/ui/dialog'
import { FcGoogle } from 'react-icons/fc';
import { useNavigation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
function Header() {

    const user = JSON.parse(localStorage.getItem('user'));
    const [openDailog, setOpenDailog] = useState(false);
    useEffect(() => {
        console.log(user)
    }, [])

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: () => { }
    })

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo.access_token}`,
                Accept: 'application/json'
            }
        }).then((resp) => {
            console.log(resp);
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDailog(false);
            window.location.reload()
        }).catch((error) => {
            console.error('Failed to get user profile:', error);
            toast.error('Failed to get user profile. Please try again.');
        })
    }

    return (
        <div className='flex items-center justify-between p-3 px-5 shadow-sm'>
            <img src="/logo.svg" />
            <div>
                {user ?
                    <div className='flex items-center gap-3'>
                        <a href='/create-trip'>
                            <Button variant="outline" className="text-orange-300 rounded-full">+ Create Trip</Button>
                        </a>
                        <a href='/my-trips'>
                            <Button variant="outline" className="text-orange-300 rounded-full">My Trips</Button>
                        </a>
                        <Popover>
                            <PopoverTrigger><img src={user?.picture} className='h-[33px] w-[33px] rounded-full' /></PopoverTrigger>
                            <PopoverContent>
                                <h2 className='cursor-pointer' onClick={() => {
                                    googleLogout();
                                    localStorage.clear();
                                    window.location.reload();
                                }}>Logout</h2>
                            </PopoverContent>
                        </Popover>
                    </div>
                    :
                    <Button onClick={() => setOpenDailog(true)}>Sign In</Button>
                }
            </div>
            <Dialog open={openDailog} onOpenChange={setOpenDailog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src="/logo.svg" alt="Logo" />
                            <h2 className='text-lg font-bold mt-7'>Sign In With Google</h2>
                            <p>Sign in to the App with Google authentication securely</p>
                            <Button
                                onClick={login}
                                className="flex items-center w-full gap-4 mt-5">
                                <FcGoogle className='h-7 w-7 ' />
                                Sign In With Google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header
