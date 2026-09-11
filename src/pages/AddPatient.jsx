import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

export default function AddPatient() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    patient_id: "",
    full_name: "",
    age: "",
    gender: "Male",
    phone: "",
    village: "",
  });

  const savePatient = async (e) => {
  e.preventDefault();

  const { error } = await supabase.from("patients").insert([
    {
      patient_id: patient.patient_id,
      full_name: patient.full_name,
      age: Number(patient.age),
      gender: patient.gender,
      phone: patient.phone,
      village: patient.village,
    },
  ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Patient Added Successfully");

  setPatient({
    patient_id: "",
    full_name: "",
    age: "",
    gender: "Male",
    phone: "",
    village: "",
  });

  navigate("/patients");
};

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-5xl font-bold text-blue-700 mb-8">
        Add New Patient
      </h1>

      <form onSubmit={savePatient} className="bg-white rounded-3xl shadow p-8 space-y-5"
      >
        <input
          className="w-full border rounded-xl p-4"
          placeholder="Patient ID (GC001)"
          value={patient.patient_id}
          onChange={(e) =>
            setPatient({ ...patient, patient_id: e.target.value })
          }
        />

        <input
          className="w-full border rounded-xl p-4"
          placeholder="Full Name"
          value={patient.full_name}
          onChange={(e) =>
            setPatient({ ...patient, full_name: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border rounded-xl p-4"
          placeholder="Age"
          value={patient.age}
          onChange={(e) =>
            setPatient({ ...patient, age: e.target.value })
          }
        />

        <select
          className="w-full border rounded-xl p-4"
          value={patient.gender}
          onChange={(e) =>
            setPatient({ ...patient, gender: e.target.value })
          }
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          className="w-full border rounded-xl p-4"
          placeholder="Phone Number"
          value={patient.phone}
          onChange={(e) =>
            setPatient({ ...patient, phone: e.target.value })
          }
        />

        <input
          className="w-full border rounded-xl p-4"
          placeholder="Village"
          value={patient.village}
          onChange={(e) =>
            setPatient({ ...patient, village: e.target.value })
          }
        />

        <button
  type="submit"
  className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700"
>
  Save Patient
</button>
      </form>
    </div>
  );
}







