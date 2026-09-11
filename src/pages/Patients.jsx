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

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id);

    if (!error) fetchPatients();
  }

  const filteredPatients = patients.filter((p) => {
    const value = search.toLowerCase();

    return (
      (p.full_name || "").toLowerCase().includes(value) ||
      (p.patient_id || "").toLowerCase().includes(value) ||
      (p.phone || "").toString().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-extrabold text-blue-700">
            Patients Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all registered patients.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-patient")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          + Add Patient
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-700">
            Patients List
          </h2>

          <input
            type="text"
            placeholder="🔍 Search Patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-blue-300 rounded-xl px-4 py-2 w-full md:w-80 outline-none focus:border-blue-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Patient ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-center">Age</th>
                <th className="p-3 text-center">Phone</th>
                <th className="p-3 text-center">Gender</th>
                <th className="p-3 text-center">Village</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-3 font-bold text-blue-700">
                      {patient.patient_id}
                    </td>

                    <td className="p-3 font-semibold">
                      {patient.full_name}
                    </td>

                    <td className="p-3 text-center">
                      {patient.age || "--"}
                    </td>

                    <td className="p-3 text-center">
                      {patient.phone || "--"}
                    </td>

                    <td className="p-3 text-center">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {patient.village || "--"}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/patient-details/${patient.id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/edit-patient/${patient.id}`)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-gray-500"
                  >
                    No Patients Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}