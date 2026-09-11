import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Followups() {
  const [followups, setFollowups] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    patient_name: "",
    phone: "",
    followup_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchFollowups();
  }, []);

  async function fetchFollowups() {
    const { data } = await supabase
      .from("followups")
      .select("*")
      .order("followup_date", { ascending: true });

    setFollowups(data || []);
  }

  async function getPatient(id) {
    if (!id) return;

    const { data } = await supabase
      .from("patients")
      .select("full_name, phone")
      .eq("patient_id", id)
      .single();

    if (data) {
      setForm((prev) => ({
        ...prev,
        patient_name: data.full_name,
        phone: data.phone,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        patient_name: "",
        phone: "",
      }));
    }
  }

  async function addFollowup(e) {
    e.preventDefault();

    const { error } = await supabase.from("followups").insert([
      {
        patient_id: form.patient_id,
        patient_name: form.patient_name,
        phone: form.phone,
        followup_date: form.followup_date,
        notes: form.notes,
        status: "Pending",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Follow-up Added Successfully");

    setForm({
      patient_id: "",
      patient_name: "",
      phone: "",
      followup_date: "",
      notes: "",
    });

    fetchFollowups();
  }

  async function markCompleted(id) {
    await supabase
      .from("followups")
      .update({ status: "Completed" })
      .eq("id", id);

    fetchFollowups();
  }

  async function deleteFollowup(id) {
    const ok = window.confirm("Delete this follow-up?");
    if (!ok) return;

    await supabase.from("followups").delete().eq("id", id);

    fetchFollowups();
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-5xl font-bold text-blue-700 mb-8">
        Follow-ups Dashboard
      </h1>

      {/* Form */}
      <form
        onSubmit={addFollowup}
        className="bg-white rounded-3xl shadow-xl p-8 space-y-5"
      >
        <input
          className="w-full border rounded-xl p-4"
          placeholder="Patient ID"
          value={form.patient_id}
          onChange={(e) => {
            const id = e.target.value;
            setForm({ ...form, patient_id: id });
            getPatient(id);
          }}
        />

        <input
          className="w-full border rounded-xl p-4 bg-gray-100"
          placeholder="Patient Name"
          value={form.patient_name}
          readOnly
        />

        <input
          className="w-full border rounded-xl p-4 bg-gray-100"
          placeholder="Phone Number"
          value={form.phone}
          readOnly
        />

        <input
          type="date"
          className="w-full border rounded-xl p-4"
          value={form.followup_date}
          onChange={(e) =>
            setForm({ ...form, followup_date: e.target.value })
          }
        />

        <textarea
          rows="4"
          className="w-full border rounded-xl p-4"
          placeholder="Reason / Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Add Follow-up
        </button>
      </form>

      {/* Follow-up Cards */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">
            Upcoming Follow-ups
          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            {followups.length} Scheduled
          </span>
        </div>

        {followups.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-gray-500">
              No Upcoming Follow-ups
            </h3>

            <p className="text-gray-400 mt-2">
              Add a follow-up to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {followups.map((item) => (
              <div
                key={item.id}
                className="border-l-8 border-blue-600 bg-slate-50 rounded-2xl p-5 shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {item.patient_name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      Patient ID : {item.patient_id}
                    </p>

                    <p className="text-gray-600 mt-1">
                      Phone : {item.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    <p className="mt-3 text-blue-700 font-bold text-lg">
                      {new Date(item.followup_date).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-white rounded-xl p-4 border">
                  <p className="text-sm text-gray-500 mb-2">
                    Reason / Notes
                  </p>

                  <p className="text-slate-700">{item.notes}</p>
                </div>

                <div className="flex gap-3 mt-5">
                  {item.status !== "Completed" && (
                    <button
                      onClick={() => markCompleted(item.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
                    >
                      ✓ Completed
                    </button>
                  )}

                  <button
                    onClick={() => deleteFollowup(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
