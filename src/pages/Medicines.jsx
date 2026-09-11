import { useState, useEffect } from "react";
import supabase from "../services/supabase";

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    stock: "",
    price: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("medicine_name");

    if (!error) setMedicines(data || []);
  }

  async function addMedicine(e) {
    e.preventDefault();

    if (!form.name || !form.stock || !form.price) {
      alert("Please fill all fields.");
      return;
    }

    const { error } = await supabase.from("medicines").insert([
      {
        medicine_name: form.name,
        stock: Number(form.stock),
        price: Number(form.price),
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Medicine Added Successfully ✅");

    setForm({ name: "", stock: "", price: "" });
    fetchMedicines();
  }

  async function updateStock(id, currentStock, value) {
    const newStock = currentStock + value;

    if (newStock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    await supabase
      .from("medicines")
      .update({ stock: newStock })
      .eq("id", id);

    fetchMedicines();
  }

  async function updatePrice(id, price) {
    const newPrice = prompt("Enter New Price", price);
    if (!newPrice) return;

    await supabase
      .from("medicines")
      .update({ price: Number(newPrice) })
      .eq("id", id);

    fetchMedicines();
  }

  async function deleteMedicine(id) {
    const ok = window.confirm("Delete this medicine?");
    if (!ok) return;

    await supabase.from("medicines").delete().eq("id", id);
    fetchMedicines();
  }

  const filteredMedicines = medicines.filter((med) =>
    med.medicine_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-blue-700">
          Medicines Dashboard
        </h1>

        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Manage clinic medicines, stock and prices.
        </p>
      </div>

      {/* Add Medicine Form */}
      <form
        onSubmit={addMedicine}
        className="bg-white rounded-3xl shadow-lg p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
      >
        <input
          placeholder="Medicine Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-xl p-3"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold py-3"
        >
          ➕ Add Medicine
        </button>
      </form>

      {/* Search */}
      <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">
        <input
          placeholder="🔍 Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-4"
        />
      </div>

      {/* Medicines List */}
      <div className="space-y-4">
        {filteredMedicines.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            No medicines found.
          </div>
        ) : (
          filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-3xl shadow-lg p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5"
            >
              {/* Medicine Info */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0">
                  {med.medicine_name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg md:text-2xl font-bold text-blue-700 break-words">
                    {med.medicine_name}
                  </h2>

                  <p className="text-green-600 font-bold text-lg mt-1">
                    ₹{med.price}
                  </p>

                  {med.stock <= 5 ? (
                    <span className="inline-block mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-sm">
                      ⚠ Low Stock : {med.stock}
                    </span>
                  ) : (
                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                      ✅ Stock : {med.stock}
                    </span>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 w-full lg:w-auto lg:flex lg:flex-wrap">
                <button
                  onClick={() => updateStock(med.id, med.stock, -1)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-semibold"
                >
                  − Stock
                </button>

                <button
                  onClick={() => updateStock(med.id, med.stock, 1)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-semibold"
                >
                  + Stock
                </button>

                <button
                  onClick={() => updatePrice(med.id, med.price)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg font-semibold"
                >
                  Edit Price
                </button>

                <button
                  onClick={() => deleteMedicine(med.id)}
                  className="bg-red-700 hover:bg-red-800 text-white py-2 px-3 rounded-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

