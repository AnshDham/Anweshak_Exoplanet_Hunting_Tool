import React, { useState } from "react";
import DataSubmissionSection from "../components/DataSubmissionSection";
import ResponsePage from "./ResponsePage";
import { Link } from "react-router-dom";

const HeroSection = () => (
    <section id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-indigo-950 opacity-90"></div>
        <div 
            className="absolute inset-0 bg-repeat" 
            style={{ 
                backgroundImage: 'url(https://www.transparenttextures.com/patterns/stardust.png)',
                opacity: 0.5
            }}>
        </div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-purple-500 rounded-full opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-cyan-500 rounded-full opacity-30 animate-pulse-slow-delay"></div>
        <div className="relative z-10 container mx-auto px-6">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 font-orbitron animate-fade-in-down">
                Discover Worlds Beyond
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up">
                Embark on an interstellar journey. Explore vast galaxies, identify unknown planets, and uncover the secrets of the cosmos with our advanced planetary scanner.
            </p>
           <Link 
    to="find-planet"
    className="bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50 animate-fade-in-up"
>
    Start Exploring Now

</Link>
        </div>
    </section>
);

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <DataSubmissionSection />
            <ResponsePage/>
        </>
    );
};

export default HomePage;