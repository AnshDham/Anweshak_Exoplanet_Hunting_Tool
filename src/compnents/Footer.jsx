

const Footer = () => (
    <footer className="bg-slate-900 text-gray-400">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <a href="#" className="text-xl font-bold text-white tracking-wider font-orbitron">
                         <span className="text-cyan-400">COSMIC</span>VOYAGER
                    </a>
                </div>
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <a href="#" className="hover:text-cyan-400 transition-colors">Find Planet</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">Profile</a>
                </div>
                <div>
                    <p>&copy; {new Date().getFullYear()} Cosmic Voyager. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;