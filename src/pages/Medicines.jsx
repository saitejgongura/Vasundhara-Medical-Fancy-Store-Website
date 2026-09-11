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

    alert("Medicine Added Successfully");

    setForm({
      name: "",
      stock: "",
      price: "",
    });

    fetchMedicines();
  }

  async function updateStock(id, currentStock, value) {
    const newStock = currentStock + value;

    if (newStock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    const { error } = await supabase
      .from("medicines")
      .update({ stock: newStock })
      .eq("id", id);

    if (!error) fetchMedicines();
  }

  async function updatePrice(id, price) {
    const newPrice = prompt("Enter New Price", price);

    if (!newPrice) return;

    const { error } = await supabase
      .from("medicines")
      .update({ price: Number(newPrice) })
      .eq("id", id);

    if (!error) fetchMedicines();
  }

  async function deleteMedicine(id) {
    const ok = window.confirm("Delete this medicine?");
    if (!ok) return;

    const { error } = await supabase
      .from("medicines")
      .delete()
      .eq("id", id);

    if (!error) fetchMedicines();
  }

  const filteredMedicines = medicines.filter((med) =>
    med.medicine_name.toLowerCase().includes(search.toLowerCase())
  );

return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-blue-700">
            Medicines Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage clinic medicines, stock and prices.
          </p>
        </div>
      </div>

      {/* Add Medicine */}
      <form
        onSubmit={addMedicine}
        className="bg-white rounded-3xl shadow-lg p-6 grid md:grid-cols-4 gap-4 mb-8"
      >
        <input
          placeholder="Medicine Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
          className="border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="border rounded-xl p-3"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
        >
          Add Medicine
        </button>
      </form>

      {/* Search */}
      <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">
        <input
          placeholder="Search medicine..."
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
              className="bg-white rounded-3xl shadow-lg p-5 flex flex-col lg:flex-row justify-between items-center gap-5"
            >
              {/* Medicine Info */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {med.medicine_name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {med.medicine_name}
                  </h2>

                  <p className="text-green-600 font-bold text-lg mt-1">
                    ₹{med.price}
                  </p>

                  <div className="mt-2">
                    {med.stock <= 5 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-sm">
                        Low Stock : {med.stock}
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                        Stock : {med.stock}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    updateStock(med.id, med.stock, -1)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  − Stock
                </button>

                <button
                  onClick={() =>
                    updateStock(med.id, med.stock, 1)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  + Stock
                </button>

                <button
                  onClick={() => updatePrice(med.id, med.price)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Edit Price
                </button>

                <button
                  onClick={() => deleteMedicine(med.id)}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-semibold"
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




