import { useState } from "react";
import supabase from "../services/supabase";

export default function AddPatient() {

  const [patient, setPatient] = useState({
    patient_id: "GC" + Date.now().toString().slice(-5),
    full_name: "",
    age: "",
    gender: "Male",
    phone: "",
    village: "",
    symptoms: "",
    diagnosis: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const savePatient = async () => {
    setLoading(true);

    const { error } = await supabase.from("patients").insert([patient]);

    if (error) {
      alert("Error : " + error.message);
    } else {
      alert("Patient Saved Successfully ?");

      setPatient({
        patient_id: "GC" + Date.now().toString().slice(-5),
        full_name: "",
        age: "",
        gender: "Male",
        phone: "",
        village: "",
        symptoms: "",
        diagnosis: ""
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-3xl p-8 mb-8">
        <h1 className="text-4xl font-bold">Patient Registration</h1>
        <p>Gongura Medical&Fancy Store Clinic Management System</p>
      </div>

      <div className="bg-white rounded-3xl shadow p-8">

        <div className="grid grid-cols-2 gap-5">

          <input
            name="patient_id"
            value={patient.patient_id}
            readOnly
            className="border rounded-xl p-3 bg-slate-100"
          />

          <input
            name="full_name"
            value={patient.full_name}
            onChange={handleChange}
            placeholder="Patient Name"
            className="border rounded-xl p-3"
          />

          <input
            name="age"
            value={patient.age}
            onChange={handleChange}
            placeholder="Age"
            className="border rounded-xl p-3"
          />

          <select
            name="gender"
            value={patient.gender}
            onChange={handleChange}
            className="border rounded-xl p-3"
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            name="phone"
            value={patient.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border rounded-xl p-3"
          />

          <input
            name="village"
            value={patient.village}
            onChange={handleChange}
            placeholder="Village"
            className="border rounded-xl p-3"
          />

        </div>

        <textarea
          name="symptoms"
          value={patient.symptoms}
          onChange={handleChange}
          rows="3"
          placeholder="Symptoms"
          className="w-full border rounded-xl p-4 mt-6"
        />

        <textarea
          name="diagnosis"
          value={patient.diagnosis}
          onChange={handleChange}
          rows="3"
          placeholder="Diagnosis"
          className="w-full border rounded-xl p-4 mt-5"
        />

        <button
          onClick={savePatient}
          disabled={loading}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
        >
          {loading ? "Saving..." : "Save Patient"}
        </button>

      </div>

    </div>
  );
}

