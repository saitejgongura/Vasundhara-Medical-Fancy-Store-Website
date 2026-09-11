import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import supabase from "../services/supabase";

import {
  Search,
  Bell,
  Users,
  IndianRupee,
  CalendarCheck,
  HeartPulse,
} from "lucide-react";

const stats = [
  {
    title: "Today's Patients",
    value: "42",
    color: "bg-blue-600",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "₹5,600",
    color: "bg-emerald-600",
    icon: IndianRupee,
  },
  {
    title: "Appointments",
    value: "18",
    color: "bg-orange-500",
    icon: CalendarCheck,
  },
  {
    title: "Follow-ups",
    value: "09",
    color: "bg-red-500",
    icon: HeartPulse,
  },
];

const medicines = [
  ["Paracetamol", "12 Left", "25%"],
  ["Amoxicillin", "25 Left", "45%"],
  ["ORS Packets", "8 Left", "20%"],
  ["Vitamin B12", "50 Left", "80%"],
];

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
const [patientCount, setPatientCount] = useState(0);

  
  const [queue, setQueue] = useState([]);
const [todayPatients, setTodayPatients] = useState(0);
const [todayAppointments, setTodayAppointments] = useState(0);
const [todayRevenue, setTodayRevenue] = useState(0);

  // Recent Patients
  const loadPatients = async () => {
  const { data, error, count } = await supabase
    .from("patients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.log(error);
    return;
  }

  setPatients(data || []);
  setPatientCount(count || 0);
};
  const loadPatientCount = async () => {
  const { count, error } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.log(error);
    return;
  }

  setPatientCount(count || 0);
};
// Waiting Queue
  const loadQueue = async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("status", "Waiting")
      .order("created_at");

    setQueue(data || []);
  };

  useEffect(() => {
  loadPatients();
  loadQueue();
  loadPatientCount();
  loadStats();
  loadStats();
  loadStats();
}, []);

const loadStats = async () => {
  const { count: patientCount } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true });

  const { count: appointmentCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  setTodayPatients(patientCount || 0);
  setPatientCount(patientCount || 0);
  setTodayAppointments(appointmentCount || 0);
  setTodayRevenue((appointmentCount || 0) * 200);
};

const updateStatus = async (id, status) => {
  await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  loadQueue();
  loadPatients();
    loadStats();
};


  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={20}
            />

            <input
              placeholder="Search patient..."
              className="w-full bg-white rounded-xl pl-10 py-3 shadow outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell className="text-blue-600" />

            <div className="bg-white rounded-xl shadow px-4 py-2 flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                G
              </div>

              <div>
                <p className="font-semibold text-sm">Dr. RMP Clinic</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>214
          </div>
        </div>

        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white mb-8 shadow-xl">
          <h1 className="text-4xl font-bold">Gongura Medical&Fancy Store</h1>

          <p className="text-blue-100 mt-2">
            Smart Clinic Clinic Management System
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <p className="text-blue-200">Patients Today</p>
              <h2 className="text-3xl font-bold">?{todayRevenue}</h2>
            </div>

            <div>
              <p className="text-blue-200">Revenue</p>
              <h2 className="text-3xl font-bold">?{todayRevenue}</h2>
            </div>

            <div>
              <p className="text-blue-200">Date</p>

              <h2 className="text-xl font-semibold">
                {new Date().toLocaleDateString("en-GB")}
              </h2>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {stats.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-5 shadow hover:shadow-xl transition"
            >
              <div
                className={`${card.color} w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-4`}
              >
                <card.icon size={28} />
              </div>

              <p className="text-gray-500">{card.title}</p>

              <h2 className="text-3xl font-bold">?{todayRevenue}</h2>
            </div>
          ))}
        </div>

        {/* Charts + Queue */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Side */}
          <div className="col-span-2 space-y-6">
            {/* Weekly Chart */}
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Weekly Patient Visits
              </h2>

              <svg viewBox="0 0 420 180" className="w-full">
                <polyline
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4"
                  points="10,150 70,120 130,135 190,80 250,95 310,50 370,65 410,40"
                />

                {[10, 70, 130, 190, 250, 310, 370, 410].map((x, i) => {
                  const y = [150, 120, 135, 80, 95, 50, 65, 40][i];

                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#2563EB"
                    />
                  );
                })}
              </svg>

              <div className="flex justify-between text-sm text-gray-500 mt-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <span key={day}>{day}</span>
                  )
                )}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Recent Patients
              </h2>

              {patients.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No Patients Found
                </div>
              ) : (
                patients.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-4 border-b last:border-none"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold uppercase">
                        {p.full_name?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {p.full_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {p.age} Years • {p.gender}
                        </p>
                      </div>
                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Registered
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Waiting Queue */}
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                Waiting Queue

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  {queue.length} Waiting
                </span>
              </h2>

              {queue.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No Waiting Patients Today
                </div>
              ) : (
                queue.map((q) => (
                  <div
                    key={q.id}
                    className="flex justify-between items-center border-b py-3 last:border-none"
                  >
                    <div>
                      <p className="font-semibold">
                        {q.full_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Token #{q.token_no}
                      </p>
                    </div>

                    <div className="flex gap-2">
  <button
    onClick={() => updateStatus(q.id, "Checked")}
    className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
  >
    Check In
  </button>

  <button
    onClick={() => updateStatus(q.id, "Completed")}
    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700"
  >
    Complete
  </button>
</div>
                  </div>
                ))
              )}
            </div>

            {/* Medicine Stock */}
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                Medicine Stock Alert
              </h2>

              {medicines.map((m) => (
                <div key={m[0]} className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{m[0]}</span>

                    <span>{m[1]}</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: m[2] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






















































