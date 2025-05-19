import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className="flex flex-col items-center px-4 md:px-20 lg:px-40 xl:px-56 gap-9 max-w-full">
            <h1 className="font-extrabold text-3xl md:text-5xl text-center mt-16">
                <span className="text-[#f56551]">Discover Your Next Adventure with AI :</span> Personalized Itineraries at Your Fingertips
            </h1>
            <p className="text-lg md:text-xl text-center text-gray-500 max-w-3xl">
                Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
            </p>

            <div className="w-full flex justify-center">
                <Link to={'/create-trip'}>
                    <Button>Get Started, It's Free</Button>
                </Link>
            </div>

            <img src="/land.png" alt="Landing" className="w-full max-w-md h-auto -mt-10 md:-mt-20" />
        </div>
    )
}

export default Hero
