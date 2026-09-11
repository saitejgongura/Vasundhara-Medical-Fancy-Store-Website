import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../services/supabase";

export default function EditPatient() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [patientId, setPatientId] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");

  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  const [bp, setBp] = useState("");
  const [sugar, setSugar] = useState("");
  const [weight, setWeight] = useState("");
  const [temperature, setTemperature] = useState("");

  const [doctorNotes, setDoctorNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", days: "", price: "" },
  ]);

  useEffect(() => {
    fetchPatient();
  }, []);

  async function fetchPatient() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setPatientId(data.patient_id || "");
      setFullName(data.full_name || "");
      setAge(data.age || "");
      setGender(data.gender || "Male");
      setPhone(data.phone || "");
      setVillage(data.village || "");

      setSymptoms(data.symptoms || "");
      setDiagnosis(data.diagnosis || "");

      setBp(data.bp || "");
      setSugar(data.sugar || "");
      setWeight(data.weight || "");
      setTemperature(data.temperature || "");

      setDoctorNotes(data.doctor_notes || "");
      setFollowUp(data.follow_up || "");

      setMedicines(
        Array.isArray(data.medicines) && data.medicines.length > 0
          ? data.medicines
          : [{ name: "", dosage: "", days: "", price: "" }]
      );
    }

    setLoading(false);
  }

  function updateMedicine(index, field, value) {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  }

  function addMedicine() {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", days: "", price: "" },
    ]);
  }

  function removeMedicine(index) {
    setMedicines(medicines.filter((_, i) => i !== index));
  }

  async function updatePatient(e) {
  e.preventDefault();

  const cleanedMedicines = medicines
    .filter((m) => m.name.trim() !== "")
    .map((m) => ({
      name: m.name,
      dosage: m.dosage,
      days: m.days,
      price: Number(m.price || 0),
    }));

  const { error } = await supabase
    .from("patients")
    .update({
      full_name: fullName,
      age: Number(age),
      gender: gender,
      phone: phone,
      village: village,

      symptoms: symptoms,
      diagnosis: diagnosis,

      bp: bp,
      sugar: sugar,
      weight: weight,
      temperature: temperature,

      doctor_notes: doctorNotes,
      follow_up: followUp || null,

      medicines: cleanedMedicines,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  alert("✅ Patient Updated Successfully");
  navigate("/patients");
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-3xl font-bold text-blue-700">
          Loading Patient...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl mb-8">
        <h1 className="text-4xl font-bold">Edit Patient</h1>
        <p className="mt-2 text-lg">
          Update patient information and prescription.
        </p>
      </div>

      <form
        onSubmit={updatePatient}
        className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
      >
        {/* Basic Details */}
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            Patient Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <input
              value={patientId}
              readOnly
              className="border rounded-xl p-4 bg-slate-100 font-semibold"
            />

            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border rounded-xl p-4"
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border rounded-xl p-4"
              required
            />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border rounded-xl p-4"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Phone Number"
              value={phone}
              maxLength={10}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              className="border rounded-xl p-4"
            />

            <input
              placeholder="Village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="border rounded-xl p-4"
            />
          </div>
        </div>

        {/* Medical Details */}
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-5">
            Medical Details
          </h2>

          <div className="space-y-4">
            <textarea
              placeholder="Symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full border rounded-xl p-4 h-28"
            />

            <textarea
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border rounded-xl p-4 h-28"
            />
          </div>
        </div>

        {/* Vitals */}
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-5">
            Patient Vitals
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="BP (120/80)"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              className="border rounded-xl p-4"
            />

            <input
              placeholder="Sugar"
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
              className="border rounded-xl p-4"
            />

            <input
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border rounded-xl p-4"
            />

            <input
              placeholder="Temperature (°C)"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="border rounded-xl p-4"
            />
          </div>
        </div>

        {/* Medicines */}
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-purple-700">
              Prescription Medicines
            </h2>

            <button
              type="button"
              onClick={addMedicine}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
            >
              + Add Medicine
            </button>
          </div>

          <div className="space-y-4">
            {medicines.map((med, index) => (
              <div
                key={index}
                className="grid lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl"
              >
                <input
                  placeholder="Medicine Name"
                  value={med.name}
                  onChange={(e) =>
                    updateMedicine(index, "name", e.target.value)
                  }
                  className="border rounded-xl p-3"
                />

                <input
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    updateMedicine(index, "dosage", e.target.value)
                  }
                  className="border rounded-xl p-3"
                />

                <input
                  placeholder="Days"
                  value={med.days}
                  onChange={(e) =>
                    updateMedicine(index, "days", e.target.value)
                  }
                  className="border rounded-xl p-3"
                />

                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Advice */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-700 mb-5">
            Doctor Advice & Follow-up
          </h2>

          <textarea
            placeholder="Doctor Notes / Advice"
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full border rounded-xl p-4 h-28 mb-4"
          />

          <label className="block mb-2 font-semibold text-gray-600">
            Next Visit Date
          </label>

          <input
            type="date"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            className="border rounded-xl p-4 w-full md:w-80"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate(`/patient-details/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

