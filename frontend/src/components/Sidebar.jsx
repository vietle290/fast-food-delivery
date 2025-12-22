import React, { useState, useEffect } from "react";
import { FaUtensils, FaPlus, FaBars, FaTimes, FaHome } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";

function Sidebar({ onToggle, onSelect }) {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  const navItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "Categories", icon: <BiCategory /> },
    // { name: "Add Item", icon: <FaPlus /> },
    // { name: "My Orders", icon: <IoReceiptOutline /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    onToggle && onToggle(isOpen);
  }, [isOpen, onToggle]);

  const handleSelect = (name) => {
    onSelect && onSelect(name);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-5 left-4 z-[10001] bg-[#F59E0B] text-white p-2 rounded-md shadow-lg hover:bg-[#e18c00]"
        >
          {/* {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />} */}
          <FaBars size={18} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-xl transition-all duration-300 z-[10000]
          ${
            isMobile
              ? isOpen
                ? "translate-x-0 w-64"
                : "-translate-x-full w-64"
              : isOpen
              ? "w-64"
              : "w-[80px]"
          }`}
      >
        <div className="flex items-center justify-center gap-2 py-6 border-b border-gray-200">
          <FaUtensils className="text-[#F59E0B]" size={22} />
          {isOpen && (
            <h1 className="text-xl font-bold text-gray-700">Owner Menu</h1>
          )}
          {isOpen && <FaTimes size={25} onClick={() => setIsOpen(false)} />}
        </div>

        <nav className="flex flex-col gap-1 mt-4">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item.name)}
              className={`flex items-center ${
                isOpen ? "justify-start gap-3 px-6" : "justify-center"
              } py-3 text-gray-600 hover:bg-[#FFF9F6] hover:text-[#F59E0B] transition-all`}
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Overlay (mobile) */}
      {isMobile && (
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 z-[9999] transition-opacity duration-200 ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }`}
          style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        />
      )}
    </>
  );
}

export default Sidebar;
