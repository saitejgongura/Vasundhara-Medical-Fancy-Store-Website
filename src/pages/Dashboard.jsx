import { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  IndianRupee,
  CalendarCheck,
  Pill,
  BellRing,
  TriangleAlert,
  Receipt,
  UserPlus,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [clinic, setClinic] = useState({});
  const [dashboard, setDashboard] = useState({
    patientsToday: 0,
    appointments: 0,
    revenue: 0,
    medicines: 0,
    followups: 0,
  });

  const [lowStock, setLowStock] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [todayFollowups, setTodayFollowups] = useState([]);

  useEffect(() => {
    fetchClinic();
    fetchDashboard();
  }, []);

  // ================= Clinic Details =================
  async function fetchClinic() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setClinic(data);
  }

  // ================= Dashboard Live Data =================
  async function fetchDashboard() {
    const today = new Date().toISOString().split("T")[0];

    // Patients
    const { count: patientsToday } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true });

    const { data: patientData } = await supabase
      .from("patients")
      .select("id, patient_id, full_name")
      .order("id", { ascending: false })
      .limit(5);

    setRecentPatients(patientData || []);

    // Appointments Today
    const { count: appointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("appointment_date", today);

    // Revenue Today
    const { data: billsToday } = await supabase
      .from("billing")
      .select("total_amount")
      .eq("bill_date", today);

    const revenue =
      billsToday?.reduce(
        (sum, bill) => sum + Number(bill.total_amount || 0),
        0
      ) || 0;

    // Recent Bills
    const { data: billHistory } = await supabase
      .from("billing")
      .select("bill_number, patient_name, total_amount")
      .order("id", { ascending: false })
      .limit(5);

    setRecentBills(billHistory || []);

    // Medicines
    const { data: medicines } = await supabase
      .from("medicines")
      .select("medicine_name, stock");

    setLowStock(
      medicines?.filter((med) => Number(med.stock) <= 10) || []
    );

    // Pending Follow-ups Count
    const { count: followups } = await supabase
      .from("followups")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    // Today's Follow-ups
    const { data: followupList } = await supabase
      .from("followups")
      .select("patient_name, followup_date")
      .eq("followup_date", today)
      .eq("status", "Pending");

    setTodayFollowups(followupList || []);

    setDashboard({
      patientsToday: patientsToday || 0,
      appointments: appointments || 0,
      revenue,
      medicines: medicines?.length || 0,
      followups: followups || 0,
    });
  }

  const todayDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const cards = [
    {
      title: "Patients",
      value: dashboard.patientsToday,
      color: "text-blue-700",
      bg: "bg-blue-50",
      icon: Users,
    },
    {
      title: "Revenue",
      value: `₹${dashboard.revenue}`,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: IndianRupee,
    },
    {
      title: "Appointments",
      value: dashboard.appointments,
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: CalendarCheck,
    },
    {
      title: "Medicines",
      value: dashboard.medicines,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: Pill,
    },
    {
      title: "Follow-ups",
      value: dashboard.followups,
      color: "text-pink-600",
      bg: "bg-pink-50",
      icon: BellRing,
    },
  ];

  return (
    <div className="bg-slate-100 min-h-screen p-8">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 rounded-3xl p-10 shadow-xl text-white mb-8 flex justify-between items-center">

        <div>
          <h1 className="text-5xl font-bold">
            {clinic.clinic_name || "Gongura Medical&Fancy Store"}
          </h1>

          <p className="text-xl mt-2">
            {clinic.doctor_name || "Dr. RMP Clinic"}
          </p>

          <p className="text-blue-100 mt-4">{todayDate}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-center">
          <p className="text-lg">Today's Revenue</p>

          <h2 className="text-5xl font-bold mt-3">
            ₹{dashboard.revenue}
          </h2>
        </div>

      </div>

      {/* ================= STATISTICS ================= */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon className={card.color} size={28} />
            </div>

            <p className="text-gray-500">{card.title}</p>

            <h2 className={`text-4xl font-bold mt-2 ${card.color}`}>
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ================= WIDGETS ================= */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LOW STOCK */}
        {/* LOW STOCK */}
<div className="bg-white rounded-3xl shadow-lg p-6 h-[320px] flex flex-col">
  <div className="flex items-center gap-3 mb-5">
    <TriangleAlert className="text-red-600" />
    <h2 className="text-xl font-bold text-red-600">
      Low Stock Medicines
    </h2>
  </div>

  {lowStock.length === 0 ? (
    <div className="bg-green-50 text-green-700 rounded-xl p-4 font-semibold">
      All medicines are available in stock.
    </div>
  ) : (
    <div className="overflow-y-auto max-h-64 pr-2 space-y-2 custom-scrollbar">
      {lowStock.map((med) => (
        <div
          key={med.medicine_name}
          className="flex justify-between items-center py-3 border-b"
        >
          <span className="font-medium">{med.medicine_name}</span>

          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
            {med.stock} Left
          </span>
        </div>
      ))}
    </div>
  )}
</div>
        {/* RECENT BILLS */}
       <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Receipt className="text-green-600" />
            <h2 className="text-xl font-bold text-green-700">
              Recent Bills
            </h2>
          </div>

          {recentBills.length === 0 ? (
            <p className="text-gray-500">No bills generated today.</p>
          ) : (
            recentBills.map((bill) => (
              <div
                key={bill.bill_number}
                className="flex justify-between py-3 border-b"
              >
                <div>
                  <p className="font-semibold">{bill.patient_name}</p>

                  <p className="text-sm text-blue-600">
                    {bill.bill_number}
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                   ₹{bill.total_amount}
                </span>
              </div>
            ))
          )}
        </div>

        {/* RECENT PATIENTS */}
<div className="bg-white rounded-3xl shadow-lg p-6 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer">

  <div className="flex items-center gap-3 mb-5">
    <UserPlus className="text-blue-700" size={24} />

    <h2 className="text-xl font-bold text-blue-700">
      Recent Patients
    </h2>
  </div>

  {recentPatients.length === 0 ? (
    <p className="text-gray-500">No patients available.</p>
  ) : (
    recentPatients.map((patient) => (
      <div
        key={patient.patient_id}
        className="flex items-center justify-between py-3 border-b last:border-b-0"
      >
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            {patient.full_name?.charAt(0).toUpperCase()}
          </div>

          {/* Patient Info */}
          <div>
            <p className="font-semibold text-slate-800">
              {patient.full_name}
            </p>

            <p className="text-sm text-gray-500">
              {patient.patient_id}
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate(`/patient-details/${patient.id}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          View →
        </button>
      </div>
    ))
  )}
</div>

        {/* ================= TODAY FOLLOWUPS ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-6 col-span-full">
          <div className="flex items-center gap-3 mb-6">
            <BellRing className="text-pink-600" />

            <h2 className="text-2xl font-bold text-pink-600">
              Today's Follow-ups
            </h2>
          </div>

          {todayFollowups.length === 0 ? (
            <div className="bg-green-50 text-green-700 rounded-xl p-4 font-semibold">
              No follow-ups scheduled for today.
            </div>
          ) : (
            todayFollowups.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b"
              >
                <div>
                  <p className="font-semibold">{item.patient_name}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(item.followup_date).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-semibold text-sm">
                  Pending
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}















