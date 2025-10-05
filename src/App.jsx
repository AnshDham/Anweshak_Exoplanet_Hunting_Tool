
import { Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DataSubmissionSection from "./components/DataSubmissionSection";
import ResponsePage from './pages/ResponsePage';
import FaqChat from './components/FaqChat.jsx';
import TeamSection from './components/TeamSection.jsx';

const HeroSection = () => (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden pt-20">
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
            <button className="bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50 animate-fade-in-up">
                Start Exploring Now
            </button>
        </div>
    </section>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20 transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/30">
        <div className="text-cyan-400 mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-3 font-orbitron">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const FeaturesSection = () => {
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
            title: "Real-Time Tracking",
            description: "Pinpoint planets with hyper-accurate, real-time data streams from orbital telescopes and deep space probes."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
            title: "Exoplanet Database",
            description: "Access a comprehensive, constantly updated database of all known exoplanets and their atmospheric compositions."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>,
            title: "Habitability Score",
            description: "Our proprietary algorithm analyzes planetary data to provide a detailed habitability score for potential life."
        }
    ];

    return (
        <section className="py-20 bg-indigo-950">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-white mb-4 font-orbitron">The Universe at Your Fingertips</h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">Our platform is equipped with cutting-edge technology to make your cosmic exploration seamless and insightful.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map(feature => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <DataSubmissionSection />
        </>
    );
};


function App () {
 return(
 <>
     <div className="bg-slate-900 min-h-screen text-white">
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/response" element={<ResponsePage/>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/faq" element={<FaqChat/>} />
                    <Route path="/aboutUs" element={<TeamSection/>}/>
                </Routes>
            </main>
            <Footer />
        </div>
  </>
  )
}

export default App

