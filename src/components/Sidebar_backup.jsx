import {
  LayoutDashboard,
  Users,
  Calendar,
  Pill,
  ReceiptIndianRupee,
  BarChart3,
  Settings,
  HeartPulse
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Patients", icon: Users },
  { name: "Appointments", icon: Calendar },
  { name: "Medicines", icon: Pill },
  { name: "Billing", icon: ReceiptIndianRupee },
  { name: "Reports", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-5">

      <div>

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
            <HeartPulse size={28} />
          </div>

          <div>
            <h1 className="font-bold text-xl">Gongura Medical&Fancy Store</h1>
            <p className="text-xs text-slate-400">Clinic Management System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => (
            <NavLink to={
  menu.name === "Dashboard"
    ? "/dashboard"
    : menu.name === "Patients"
    ? "/patients"
    : menu.name === "Appointments"
    ? "/appointments"
    : menu.name === "Medicines"
    ? "/medicines"
    : menu.name === "Billing"
    ? "/billing"
    : menu.name === "Reports"
    ? "/reports"
    : "/settings"
}
              key={menu.name}
              className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-800 text-slate-300"}` }
            >
              <menu.icon size={20} />
              <span>{menu.name}</span>
            </NavLink>
          ))}
        </nav>

      </div>

      <div className="bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
            G
          </div>

          <div>
            <p className="font-semibold">Dr. RMP Clinic</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
      </div>

    </aside>
  );
}



