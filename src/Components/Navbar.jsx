import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import profileIcon from "../assets/profile_icon.png";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const {user, setUser} = useContext(AppContext);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Villas", path: "/Villas" },
    { name: "Rooms", path: "/rooms" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = async() => {
    setUser(false);
    toast.success("Logout Successful");
  }

  return (
    <div>
      {/* Dummy content to test scrolling */}
      <p className="w-10 h-[100px]"></p>

      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between 
          px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50
          ${
            isScrolled
              ? "bg-[#0D0D0D] shadow-md text-[#FFFFFF] backdrop-blur-lg py-3 md:py-4"
              : "bg-[#1E1E1E]/60 text-white backdrop-blur-md py-4 md:py-6"
          }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span
            className="font-extrabold text-2xl md:text-3xl tracking-wide 
               bg-gradient-to-r from-yellow-400 to-yellow-600 
               bg-clip-text text-transparent drop-shadow-md"
          >
            Stavilo
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className="group flex flex-col gap-0.5"
            >
              {link.name}
              <div className="bg-current h-0.5 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
          <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer">
            Owner
          </button>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          {
            user?(
              <div className="relative group inline-block">
                <img src={profileIcon} alt="Profile" className="w-12 h-12 rounded-full cursor-pointer" />
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-300 z-50">
                  <ul className="py-2">
                    <li>
                      <Link
                        to={"/my-bookings"}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      >My Bookings</Link>
                    </li>
                    <li onClick={logout}>
                      <Link className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ):(
              <button onClick={() => navigate("/login")} className="px-8 py-2.5 rounded-full ml-4 transition-all duration-500 bg-[#6A0DAD] text-[#FFFFFF] cursor-pointer hover:bg-[#FFD369] hover:text-[#6A0DAD] ">
                Login
              </button>
            )
          }

          
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-6 w-6 cursor-pointer"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base 
            flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 
            transition-all duration-500 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </Link>
          ))}

          <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer" onClick={() => setIsMenuOpen(false)}>
            Owner
          </button>

          <div className="flex md:hidden items-center gap-4">
          {
            user?(
              <div className="relative group inline-block">
                <img src={profileIcon} alt="Profile" className="w-12 h-12 rounded-full cursor-pointer" />
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-300 z-50">
                  <ul className="py-2">
                    <li>
                      <Link
                        to={"/my-bookings"}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      >My Bookings</Link>
                    </li>
                    <li onClick={logout}>
                      <Link className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ):(
              <button onClick={() => navigate("/login")} className="px-8 py-2.5 rounded-full transition-all duration-500 bg-blue-400 text-black cursor-pointer hover:bg-indigo-600 hover:text-white ">
                Login
              </button>
            )
          }

          
        </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
