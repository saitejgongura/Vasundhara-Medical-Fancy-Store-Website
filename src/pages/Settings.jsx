import { useEffect, useState } from "react";
import supabase from "../services/supabase";

export default function Settings() {
  const [settings, setSettings] = useState({
    clinic_name: "",
    doctor_name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

    if (data) setSettings(data);
  }

  async function saveSettings(e) {
    e.preventDefault();
    setLoading(true);

    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .single();

    let error;

    if (existing) {
      ({ error } = await supabase
        .from("settings")
        .update({
          clinic_name: settings.clinic_name,
          doctor_name: settings.doctor_name,
          phone: settings.phone,
          address: settings.address,
        })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("settings").insert(settings));
    }

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Clinic Settings Saved Successfully");
      fetchSettings();
    }
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-5xl font-bold text-blue-700 mb-2">
        Clinic Settings
      </h1>

      <p className="text-gray-500 mb-8">
        Update clinic information used across Dashboard, Billing and Reports.
      </p>

      <form
        onSubmit={saveSettings}
        className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
      >
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Clinic Name
          </label>

          <input
            className="w-full border rounded-xl p-4"
            placeholder="Enter Clinic Name"
            value={settings.clinic_name || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                clinic_name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Doctor Name
          </label>

          <input
            className="w-full border rounded-xl p-4"
            placeholder="Enter Doctor Name"
            value={settings.doctor_name || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                doctor_name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Phone Number
          </label>

          <input
            className="w-full border rounded-xl p-4"
            placeholder="Enter Phone Number"
            value={settings.phone || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                phone: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Clinic Address
          </label>

          <textarea
            rows={4}
            className="w-full border rounded-xl p-4"
            placeholder="Enter Clinic Address"
            value={settings.address || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                address: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold"
        >
          {loading ? "Saving..." : "Save Clinic Settings"}
        </button>
      </form>

      <div className="mt-8 bg-blue-50 rounded-3xl p-6 shadow">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Live Preview
        </h2>

        <div className="space-y-2 text-lg">
          <p><strong>Clinic :</strong> {settings.clinic_name}</p>
          <p><strong>Doctor :</strong> {settings.doctor_name}</p>
          <p><strong>Phone :</strong> {settings.phone}</p>
          <p><strong>Address :</strong> {settings.address}</p>
        </div>
      </div>
    </div>
  );
}
