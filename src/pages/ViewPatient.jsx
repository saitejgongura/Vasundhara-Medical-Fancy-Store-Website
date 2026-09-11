import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../services/supabase";

export default function ViewPatient() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, []);

  async function fetchPatient() {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    setPatient(data);
  }

  if (!patient) return <h2 className="p-8">Loading...</h2>;

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-5xl font-bold text-blue-700 mb-8">
        Patient Details
      </h1>

      <div className="bg-white rounded-3xl shadow p-8 space-y-4">
        <p><b>Patient ID:</b> {patient.patient_id}</p>
        <p><b>Name:</b> {patient.full_name}</p>
        <p><b>Age:</b> {patient.age}</p>
        <p><b>Gender:</b> {patient.gender}</p>
        <p><b>Phone:</b> {patient.phone}</p>
        <p><b>Village:</b> {patient.village}</p>
      </div>
    </div>
  );
}

