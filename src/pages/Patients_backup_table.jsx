import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

export default function Patients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setPatients(data || []);
  }

  async function deletePatient(id) {
    const ok = window.confirm("Delete this patient?");
    if (!ok) return;

    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (!error) fetchPatients();
  }

  const filteredPatients = patients.filter((p) => {
    const name = p.full_name?.toLowerCase() || "";
    const phone = p.phone?.toString() || "";

    return (
      name.includes(search.toLowerCase()) ||
      phone.includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-8">
        <div>
          <h1 className="text-5xl font-extrabold text-blue-700">
            Patients Dashboard
          </h1>

          <p className="text-gray-500 text-lg mt-2">
            Manage all registered patients in your clinic.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-patient")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-2xl font-semibold shadow-lg transition-all"
        >
          + Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">
        <input
          type="text"
          placeholder="Search patient by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border-2 border-slate-200 rounded-xl px-5 py-4 text-lg outline-none focus:border-blue-500"
        />
      </div>

      {/* Patients Cards */}
      <div className="grid lg:grid-cols-2 gap-7">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-[28px] shadow-lg hover:shadow-2xl transition-all border border-blue-100 p-6"
          >
            {/* Top Section */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  {patient.full_name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {patient.full_name}
                  </h2>

                  <p className="text-blue-600 font-semibold text-lg">
                    {patient.patient_id}
                  </p>
                </div>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                {patient.gender}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Age</p>

                <p className="text-2xl font-bold text-slate-800">
                  {patient.age || "--"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Phone</p>

                <p className="font-bold text-lg text-slate-800">
                  {patient.phone || "--"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Village</p>

                <p className="font-bold text-lg text-slate-800">
                  {patient.village || "--"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Gender</p>

                <p className="font-bold text-lg text-slate-800">
                  {patient.gender || "--"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* View */}
              <button
                onClick={() => navigate(`/patient-details/${patient.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all"
              >
                View
              </button>

              {/* Edit */}
              <button
                onClick={() => navigate(`/edit-patient/${patient.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Edit
              </button>

              {/* Delete */}
              <button
                onClick={() => deletePatient(patient.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center mt-8">
          <h2 className="text-2xl font-bold text-gray-700">
            No Patients Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search or add a new patient.
          </p>
        </div>
      )}
    </div>
  );
}
