import { useState } from "react";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Pill,
  Receipt,
  BellRing,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import supabase from "../services/supabase";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Appointments", icon: CalendarDays, path: "/appointments" },
    { name: "Medicines", icon: Pill, path: "/medicines" },
    { name: "Billing", icon: Receipt, path: "/billing" },
    { name: "Follow-ups", icon: BellRing, path: "/followups" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-72 h-screen bg-slate-950 text-white
          flex flex-col justify-between shadow-2xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Section */}
        <div>
          {/* Mobile Close Button */}
          <div className="flex justify-end md:hidden p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white"
            >
              <X size={26} />
            </button>
          </div>

          {/* Logo */}
          <div className="px-6 pb-6 md:pt-8 border-b border-slate-800 text-center">
            <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full overflow-hidden bg-white border-4 border-yellow-400 shadow-xl p-1">
              <img
                src={logo}
                alt="Vasundhara Medical & Fancy Store"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mt-5">
              Vasundhara
            </h1>

            <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
              Medical & Fancy Store
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Clinic Management System
            </p>
          </div>

          {/* Menu */}
          <nav className="px-4 py-6 space-y-2 overflow-y-auto">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-medium text-base md:text-lg ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={22} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded-2xl p-3 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 bg-white">
              <img
                src={logo}
                alt="Admin Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">
                Vasundhara Admin
              </h3>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}