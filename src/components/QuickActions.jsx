import { UserPlus, CalendarPlus, FileText, Pill } from "lucide-react";

const actions = [
  { title: "Add Patient", color: "bg-blue-600", icon: UserPlus },
  { title: "New Appointment", color: "bg-emerald-600", icon: CalendarPlus },
  { title: "Prescription", color: "bg-violet-600", icon: FileText },
  { title: "Medicine Stock", color: "bg-orange-500", icon: Pill },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h2 className="text-xl font-bold mb-5 text-slate-800">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((a) => (
          <button
            key={a.title}
            className="rounded-2xl p-5 text-white hover:scale-105 transition shadow-lg flex flex-col items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500"
          >
            <a.icon size={28} />
            <span className="font-semibold text-center">{a.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

