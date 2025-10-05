import React from 'react';

const Footer = () => (
    <footer className="bg-slate-900 text-gray-400">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                {/* Brand Name */}
                <div className="mb-4 md:mb-0">
                    <a href="#" className="text-xl font-bold text-white tracking-wider font-orbitron">
                         <span className="text-cyan-400">ANWE</span>SHAK
                    </a>
                </div>

                {/* Contact and Copyright Info */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                     <a 
                        href="mailto:erudbell247@gmail.com" 
                        className="hover:text-cyan-400 transition-colors duration-300"
                    >
                        Contact Us
                    </a>
                    <p>&copy; {new Date().getFullYear()} ANWESHAK. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;