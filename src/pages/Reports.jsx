import { useEffect, useState } from "react";
import supabase from "../services/supabase";
import {
  IndianRupee,
  Users,
  CalendarDays,
  Pill,
  TriangleAlert,
  CircleX,
} from "lucide-react";

export default function Reports() {
  const today = new Date().toISOString().split("T")[0];

  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalPatients: 0,
    todayAppointments: 0,
    totalMedicines: 0,
    lowStock: 0,
    outStock: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState(new Array(12).fill(0));
  const [medicineReport, setMedicineReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    const [billingRes, patientRes, appointmentRes, medicineRes] =
      await Promise.all([
        supabase.from("billing").select("*"),
        supabase.from("patients").select("id"),
        supabase.from("appointments").select("*"),
        supabase.from("medicines").select("*").order("medicine_name"),
      ]);

    const bills = billingRes.data || [];
    const patients = patientRes.data || [];
    const appointments = appointmentRes.data || [];
    const medicines = medicineRes.data || [];

    const totalRevenue = bills.reduce(
      (sum, bill) => sum + Number(bill.total_amount || 0),
      0
    );

    const todayRevenue = bills
      .filter((bill) => {
        const billDate =
          bill.created_at?.split("T")[0] || bill.bill_date || "";
        return billDate === today;
      })
      .reduce((sum, bill) => sum + Number(bill.total_amount || 0), 0);

    const todayAppointments = appointments.filter(
      (a) => a.appointment_date === today
    ).length;

    const months = new Array(12).fill(0);

    bills.forEach((bill) => {
      const date = new Date(bill.created_at || bill.bill_date);

      if (!isNaN(date)) {
        months[date.getMonth()] += Number(bill.total_amount || 0);
      }
    });

    const lowStock = medicines.filter(
      (m) => Number(m.stock) > 0 && Number(m.stock) <= 20
    ).length;

    const outStock = medicines.filter((m) => Number(m.stock) <= 0).length;

    setStats({
      totalRevenue,
      todayRevenue,
      totalPatients: patients.length,
      todayAppointments,
      totalMedicines: medicines.length,
      lowStock,
      outStock,
    });

    setMonthlyRevenue(months);
    setMedicineReport(medicines);
  }

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const maxRevenue = Math.max(...monthlyRevenue, 1);

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: IndianRupee,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue}`,
      icon: IndianRupee,
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "from-purple-600 to-pink-500",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: CalendarDays,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Medicines",
      value: stats.totalMedicines,
      icon: Pill,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: TriangleAlert,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Out Of Stock",
      value: stats.outStock,
      icon: CircleX,
      color: "from-red-500 to-red-700",
    },
  ];

  const lowStockMedicines = medicineReport.filter(
    (m) => Number(m.stock) > 0 && Number(m.stock) <= 20
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-bold text-blue-700 mb-2">
        Reports Dashboard
      </h1>

      <p className="text-gray-500 mb-8 text-sm md:text-base">
        Revenue, Patients, Appointments and Medicine Stock Reports.
      </p>

      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.color} rounded-3xl text-white p-4 md:p-6 shadow-xl`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs md:text-sm opacity-90">
                    {card.title}
                  </p>

                  <h2 className="text-2xl md:text-4xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <Icon size={32} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white rounded-3xl shadow-lg p-5 md:p-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6">
          Monthly Revenue (Jan – Dec)
        </h2>

        <div className="overflow-x-auto">
          <div className="min-w-[700px] h-72 flex items-end gap-3">
            {monthlyRevenue.map((value, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
              >
                <div className="text-xs font-bold text-green-600 mb-2">
                  ₹{value}
                </div>

                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400"
                  style={{
                    height: `${(value / maxRevenue) * 180 + 12}px`,
                  }}
                />

                <span className="text-xs md:text-sm mt-2 font-semibold text-gray-600">
                  {monthNames[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Medicines */}
      <div className="bg-white rounded-3xl shadow-lg p-5 md:p-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-5">
          Low Stock Medicines
        </h2>

        {lowStockMedicines.length === 0 ? (
          <p className="text-green-600 font-semibold">
            ✅ All medicines have sufficient stock.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lowStockMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className="border-l-4 border-yellow-500 bg-yellow-50 rounded-xl p-4"
              >
                <h3 className="font-bold text-lg text-slate-800">
                  {medicine.medicine_name}
                </h3>

                <p className="text-red-600 font-bold mt-2">
                  Stock Left : {medicine.stock}
                </p>

                <p className="text-green-700 mt-1">
                  Price : ₹{medicine.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medicine Stock Report */}
      <div className="bg-white rounded-3xl shadow-lg p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">
          Medicine Stock Report
        </h2>

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-[650px] w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Medicine</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {medicineReport.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No Medicine Data
                  </td>
                </tr>
              ) : (
                medicineReport.map((medicine) => {
                  const stock = Number(medicine.stock || 0);

                  let badge = "bg-green-100 text-green-700";
                  let status = "Available";

                  if (stock <= 0) {
                    badge = "bg-red-100 text-red-700";
                    status = "Out Of Stock";
                  } else if (stock <= 20) {
                    badge = "bg-yellow-100 text-yellow-700";
                    status = "Low Stock";
                  }

                  return (
                    <tr
                      key={medicine.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {medicine.medicine_name}
                      </td>

                      <td className="p-4 text-center">
                        ₹{medicine.price}
                      </td>

                      <td className="p-4 text-center font-bold">
                        {stock}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`${badge} px-4 py-2 rounded-full text-sm font-bold`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}