import { useState } from "react";
import { Link } from "react-router-dom";

const RocketIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.1S5.21 15.24 4.5 16.5Z" />
    <path d="m12 15-3-3a9 9 0 0 1 3-13v13a9 9 0 0 1-3-13Z" />
    <path d="M15 12a9 9 0 0 1-9-9" />
    <path d="M19.5 16.5c1.5 1.26 2 5 2 5s-3.74-.5-5-2c-.71-.84-.7-2.3.05-3.1s2.15-1.06 2.45-1.4Z" />
  </svg>
);
const HomeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const InfoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MenuIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        setIsMenuOpen(false); // Close mobile menu after clicking
    };

    // When using React Router, you would replace <Link> with <Link> from 'react-router-dom'
    const navLinks = [
        { to: "home", text: "Home", icon: <HomeIcon className="w-5 h-5" />, isLink: true },
        { to: "find-planet", text: "Find Planet", icon: <RocketIcon className="w-5 h-5" />, isLink: false },
        { to: "/aboutUs", text: "Know Us", icon: <InfoIcon className="w-5 h-5" />, isLink: true },
        { to: "/faq", text: "faq", icon: <UserIcon className="w-5 h-5" />, isLink: true },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="#" className="text-2xl font-bold text-white tracking-wider font-orbitron">
                    <span className="text-cyan-400">ANWE</span>SHAK
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        link.isLink ? (
                            <Link key={link.text} to={link.to} className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                                {link.icon}
                                <span>{link.text}</span>
                            </Link>
                        ) : (
                            <button 
                                key={link.text} 
                                onClick={() => handleScrollToSection(link.to)} 
                                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-300 focus:outline-none"
                            >
                                {link.icon}
                                <span>{link.text}</span>
                            </button>
                        )
                    ))}
                </nav>
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                        {isMenuOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                 <div className="md:hidden bg-slate-900/90 backdrop-blur-lg">
                    <nav className="flex flex-col items-center space-y-6 py-8">
                        {navLinks.map((link) => (
                            link.isLink ? (
                                <Link key={link.text} to={link.to} className="flex items-center space-x-3 text-lg text-gray-200 hover:text-cyan-400 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                                    {link.icon}
                                    <span>{link.text}</span>
                                </Link>
                            ) : (
                                <button 
                                    key={link.text} 
                                    onClick={() => handleScrollToSection(link.to)} 
                                    className="flex items-center space-x-3 text-lg text-gray-200 hover:text-cyan-400 transition-colors duration-300 focus:outline-none"
                                >
                                    {link.icon}
                                    <span>{link.text}</span>
                                </button>
                            )
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;