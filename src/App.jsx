import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import TawkTo from "./components/TawkTo";

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}