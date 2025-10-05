import React from 'react';

// Data for team members - easy to update
const teamMembers = [
     {
        name: "Ansh Dham",
        role: "Research & Strategy (LEADERSHIP)",
        description: "Manages project goals, liaises with external research resources, and handles team representation and documentation.",
        imageUrl: "./public/6.jpg",
        linkedinUrl: "https://www.linkedin.com/in/anshdham04?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        theme: {
            border: "border-yellow-500/50",
            text: "text-yellow-300",
            imageBorder: "border-yellow-400",
            hoverIcon: "hover:text-yellow-400"
        }
    },
    {
        name: "Shashank Roy",
        role: "AI/ML Specialist",
        description: "Lead model architect, specializing in time-series analysis for exoplanet transit data from Kepler and TESS missions.",
        imageUrl: "./public/4.png", // Assuming images are in the public/image directory
        linkedinUrl: "https://www.linkedin.com/in/shashank-roy-iitp?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        theme: {
            border: "border-sky-500/50",
            text: "text-sky-300",
            imageBorder: "border-sky-400",
            hoverIcon: "hover:text-sky-400"
        }
    },
    {
        name: "Roshan Kumar",
        role: "AI/ML Specialist",
        description: "Focuses on feature engineering and dataset optimization to boost classification accuracy of planetary candidates.",
        imageUrl: "./public/2.jpg",
        linkedinUrl: "https://www.linkedin.com/in/roshan-kumar-670529317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        theme: {
            border: "border-sky-500/50",
            text: "text-sky-300",
            imageBorder: "border-sky-400",
            hoverIcon: "hover:text-sky-400"
        }
    },
    {
        name: "Anjali Prajapat",
        role: "AI/ML Assistant",
        description: "Expert in deep learning networks, responsible for training the core predictive model on large-scale public data.",
        imageUrl: "./public/3.jpg",
        linkedinUrl: "https://www.linkedin.com/in/anjali-prajapat-046a24360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        theme: {
            border: "border-sky-500/50",
            text: "text-sky-300",
            imageBorder: "border-sky-400",
            hoverIcon: "hover:text-sky-400"
        }
    },
    {
        name: "Yash Devani",
        role: "Web Dev Specialist",
        description: "Frontend lead, focused on creating the interactive user interface and responsive dashboard visualizations.",
        imageUrl: "./public/7.png",
        linkedinUrl: "https://www.linkedin.com/in/yash-devani-744297324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        theme: {
            border: "border-emerald-500/50",
            text: "text-emerald-300",
            imageBorder: "border-emerald-400",
            hoverIcon: "hover:text-emerald-400"
        }
    },
    {
        name: "Satish Kr Sharma",
        role: "Web Dev Specialist",
        description: "Frontend lead, focused on creating the interactive user interface and responsive dashboard visualizations.",
        imageUrl: "./public/5.jpg",
        linkedinUrl: "https://www.linkedin.com/in/satish-kumar-sharma-a60002326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        theme: {
            border: "border-emerald-500/50",
            text: "text-emerald-300",
            imageBorder: "border-emerald-400",
            hoverIcon: "hover:text-emerald-400"
        }
    }
];

// Reusable LinkedIn Icon Component
const LinkedInIcon = ({ hoverClass }) => (
    <svg className={`w-12 h-12 text-white ${hoverClass} transition`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.13-4 0v5.604h-3v-11h3v1.765c1.393-2.618 7-2.738 7 2.396v6.839z"/>
    </svg>
);

// Component for a single team member card
const TeamMemberCard = ({ member }) => (
    <div id='aboutUs' className={`bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border ${member.theme.border} group relative overflow-hidden`}>
        <a 
            href={member.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 cursor-pointer" 
            aria-label={`LinkedIn profile for ${member.name}`}
        >
            <LinkedInIcon hoverClass={member.theme.hoverIcon} />
        </a>
        <img 
            src={member.imageUrl} 
            alt={member.name} 
            className={`w-24 h-24 rounded-full mx-auto mb-4 border-4 ${member.theme.imageBorder}`} 
        />
        <h3 className="text-2xl font-bold text-white">{member.name}</h3>
        <p className={`${member.theme.text} font-semibold mb-3`}>{member.role}</p>
        <p className="text-gray-400 text-sm">{member.description}</p>
    </div>
);


// The main Team Section Component
const TeamSection = () => {
    return (
        // The main container with background color and font styles
        <section id="team" className="py-20 px-4 md:px-8 bg-[#000022] font-['Inter',_sans-serif]">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl text-white font-light mb-8 text-center border-b border-gray-700 pb-2 [text-shadow:0_0_5px_rgba(255,255,255,0.5),_0_0_15px_rgba(255,255,255,0.3)]">
                    Meet the ANWESHAK
                </h2>
                <p className="text-xl text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                    The diverse minds powering this project, from machine learning to space research.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                        <TeamMemberCard key={member.name} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;