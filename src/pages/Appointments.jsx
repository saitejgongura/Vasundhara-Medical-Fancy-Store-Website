import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

export default function Appointments() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    phone: "",
    date: today,
    time: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  async function fetchPatients() {
    const { data } = await supabase
      .from("patients")
      .select("patient_id, full_name, phone")
      .order("full_name");

    setPatients(data || []);
  }

  async function fetchAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });

    setAppointments(data || []);
  }

  function selectPatient(patientId) {
    const patient = patients.find((p) => p.patient_id === patientId);

    if (!patient) return;

    setForm({
      ...form,
      patientId: patient.patient_id,
      patientName: patient.full_name,
      phone: patient.phone,
    });
  }

  async function bookAppointment(e) {
    e.preventDefault();

    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: form.patientId,
        patient_name: form.patientName,
        phone: form.phone,
        appointment_date: form.date,
        appointment_time: form.time,
        status: "Pending",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Appointment Booked Successfully ✅");

    setForm({
      patientId: "",
      patientName: "",
      phone: "",
      date: today,
      time: "",
    });

    fetchAppointments();
  }

  async function completeAppointment(id) {
    await supabase
      .from("appointments")
      .update({ status: "Completed" })
      .eq("id", id);

    fetchAppointments();
  }

  async function deleteAppointment(id) {
    const ok = window.confirm("Cancel this appointment?");
    if (!ok) return;

    await supabase.from("appointments").delete().eq("id", id);

    fetchAppointments();
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-5xl font-bold text-blue-700 mb-8">
        Appointments Dashboard
      </h1>

      {/* Book Appointment */}
      <form
        onSubmit={bookAppointment}
        className="bg-white p-8 rounded-3xl shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-3">
          Book Appointment
        </h2>

        {/* Patient Dropdown */}
        <select
          value={form.patientId}
          onChange={(e) => selectPatient(e.target.value)}
          className="w-full border rounded-xl p-4"
          required
        >
          <option value="">Select Patient</option>

          {patients.map((patient) => (
            <option key={patient.patient_id} value={patient.patient_id}>
              {patient.patient_id} — {patient.full_name}
            </option>
          ))}
        </select>

        <input
          className="w-full border rounded-xl p-4 bg-slate-100"
          value={form.patientName}
          readOnly
          placeholder="Patient Name"
        />

        <input
          className="w-full border rounded-xl p-4 bg-slate-100"
          value={form.phone}
          readOnly
          placeholder="Phone Number"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            className="border rounded-xl p-4"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            required
          />

          <input
            type="time"
            className="border rounded-xl p-4"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Book Appointment
        </button>
      </form>

      {/* Appointment List */}
      <div className="mt-10 bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Today's Appointments ({appointments.length})
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No appointments found.
          </p>
        ) : (
          appointments.map((item) => (
            <div
              key={item.id}
              className="border-b py-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {item.patient_name}
                </h3>

                <p className="text-blue-600 font-semibold">
                  {item.patient_id}
                </p>

                <p className="text-gray-600">{item.phone}</p>

                <p className="text-gray-500">
                  {item.appointment_date} • {item.appointment_time}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </div>

              <div className="flex gap-3 flex-wrap">
               <button
                 onClick={() => navigate(`/patient-details/${item.patient_id}`)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  View
                </button>

                <button
                  onClick={() => completeAppointment(item.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Completed
                </button>

                <button
                  onClick={() => deleteAppointment(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
 
    </div>
  );
}