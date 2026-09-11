import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../services/supabase";
import PrescriptionCard from "../components/PrescriptionCard";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  async function fetchPatient() {
    // First try patient_id (GC001)
    let { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", id)
      .single();

    // If not found, try numeric id
    if (error || !data) {
      const result = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      data = result.data;
      error = result.error;
    }

    if (!error && data) {
      setPatient(data);
    }
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <h1 className="text-2xl font-bold text-blue-700">
          Loading Patient...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-3xl p-8 text-white shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-5xl font-bold">
              {patient.full_name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-4xl font-bold">{patient.full_name}</h1>
              <p className="text-lg mt-2">
                Patient ID : {patient.patient_id}
              </p>
            </div>
          </div>

          <span className="bg-white text-blue-700 px-5 py-2 rounded-full font-bold text-lg">
            {patient.gender}
          </span>
        </div>
      </div>

      {/* Patient Info + Medical */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            Patient Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">Age</p>
              <p className="text-2xl font-bold">{patient.age || "--"}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-bold">{patient.phone || "--"}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">Village</p>
              <p className="font-bold">{patient.village || "--"}</p>
            </div>

            <div className="bg-pink-50 rounded-xl p-4">
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-bold">{patient.gender || "--"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-5">
            Medical Details
          </h2>

          <div className="space-y-5">
            <div>
              <p className="text-gray-500 text-sm mb-2">Symptoms</p>
              <div className="bg-slate-50 rounded-xl p-4 min-h-[70px]">
                {patient.symptoms || "No symptoms recorded"}
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Diagnosis</p>
              <div className="bg-slate-50 rounded-xl p-4 min-h-[70px]">
                {patient.diagnosis || "No diagnosis recorded"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <h2 className="text-3xl font-bold text-slate-700 mb-4">Vitals</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-red-50 rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Blood Pressure</p>
          <h3 className="text-3xl font-bold text-red-600 mt-2">
            {patient.bp || "--/--"}
          </h3>
        </div>

        <div className="bg-green-50 rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Sugar</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {patient.sugar || "--"}
          </h3>
        </div>

        <div className="bg-blue-50 rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Weight</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-2">
            {patient.weight || "--"} kg
          </h3>
        </div>

        <div className="bg-orange-50 rounded-2xl p-5 shadow">
          <p className="text-gray-500 text-sm">Temperature</p>
          <h3 className="text-3xl font-bold text-orange-600 mt-2">
            {patient.temperature || "--"}°C
          </h3>
        </div>
      </div>

      {/* Prescription */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-slate-700 mb-5">
          Prescription
        </h2>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-5 py-3">Medicine</th>
                <th className="text-center px-5 py-3">Dosage</th>
                <th className="text-center px-5 py-3">Days</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(patient.medicines) &&
              patient.medicines.length > 0 ? (
                patient.medicines.map((m, index) => (
                  <tr key={index} className="border-t even:bg-slate-50">
                    <td className="px-5 py-4">{m.name}</td>
                    <td className="text-center">{m.dosage}</td>
                    <td className="text-center">{m.days}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">
                    No medicines prescribed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Advice */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-4">Doctor Advice</h2>

          <p className="mb-3">
            {patient.doctor_notes ||
              "Take medicines on time, drink plenty of water and get enough rest."}
          </p>

          <p>
            <span className="font-semibold">Next Visit :</span>{" "}
            {patient.follow_up || "Not Scheduled"}
          </p>
        </div>

        <PrescriptionCard patient={patient} />
      </div>
    </div>
  );
}