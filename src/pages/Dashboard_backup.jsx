import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    patientsToday: 0,
    appointments: 0,
    revenue: 0,
    followups: 9,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    const today = new Date().toISOString().split("T")[0];

    const { count: patientsToday } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true });

    const { count: appointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("appointment_date", today);

    const { data: bills } = await supabase
      .from("billing")
      .select("total_amount");

    const revenue =
      bills?.reduce((sum, bill) => sum + Number(bill.total_amount || 0), 0) || 0;

    setDashboard({
      patientsToday: patientsToday || 0,
      appointments: appointments || 0,
      revenue,
      followups: 9,
    });
  }

  const todayDate = new Date().toLocaleDateString("en-GB");

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-3xl p-10 text-white mb-8">
        <h1 className="text-6xl font-bold mb-3">Gongura Medical&Fancy Store</h1>
        <p className="text-2xl mb-10">Smart Clinic Clinic Management System</p>

        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-xl">Patients Today</p>
            <h2 className="text-5xl font-bold">{dashboard.patientsToday}</h2>
          </div>

          <div>
            <p className="text-xl">Revenue</p>
            <h2 className="text-5xl font-bold">₹{dashboard.revenue}</h2>
          </div>

          <div>
            <p className="text-xl">Date</p>
            <h2 className="text-4xl font-bold">{todayDate}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Today's Patients</p>
          <h2 className="text-5xl font-bold">{dashboard.patientsToday}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-5xl font-bold">₹{dashboard.revenue}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Appointments</p>
          <h2 className="text-5xl font-bold">{dashboard.appointments}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <p className="text-gray-500">Follow-ups</p>
          <h2 className="text-5xl font-bold">{dashboard.followups}</h2>
        </div>
      </div>
    </div>
  );
}
