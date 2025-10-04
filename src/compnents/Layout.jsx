import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

const Layout = ({ children }) => {
    return (
        <div className="bg-slate-900 min-h-screen text-white">
            <Header />
            <main>
                <Outlet/>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;