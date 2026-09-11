import { useEffect, useState } from "react";
import supabase from "../services/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Billing() {
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    medicineName: "",
    quantity: 1,
    price: "",
  });

  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    const { data } = await supabase
      .from("billing")
      .select("*")
      .order("id", { ascending: false });

    setBills(data || []);
  }

  async function getPatient(id) {
    if (!id) return;

    const { data } = await supabase
      .from("patients")
      .select("full_name")
      .eq("patient_id", id)
      .single();

    if (data) {
      setForm((prev) => ({
        ...prev,
        patientName: data.full_name,
      }));
    }
  }

  async function generateBill(e) {
    e.preventDefault();

    const total = Number(form.quantity) * Number(form.price);

    const { error } = await supabase.from("billing").insert([
      {
        patient_id: form.patientId,
        patient_name: form.patientName,
        medicine_name: form.medicineName,
        quantity: Number(form.quantity),
        price: Number(form.price),
        total_amount: total,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Bill Generated Successfully");

    setForm({
      patientId: "",
      patientName: "",
      medicineName: "",
      quantity: 1,
      price: "",
    });

    fetchBills();
  }

  const printBill = () => {
  const total = Number(form.quantity || 0) * Number(form.price || 0);

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Gongura Medical&Fancy Store", 20, 20);

  doc.setFontSize(12);
  doc.text("Dr. RMP Clinic", 20, 30);
  doc.text("Phone: 9550588663", 20, 38);

  autoTable(doc, {
    startY: 50,
    head: [["Medicine", "Qty", "Price", "Total"]],
    body: [[
      form.medicine_name,
      form.quantity,
      "?" + form.price,
      "?" + total,
    ]],
  });

  doc.text("Patient: " + form.patient_name, 20, doc.lastAutoTable.finalY + 15);
  doc.text("Grand Total: ?" + total, 20, doc.lastAutoTable.finalY + 25);

  doc.save("Bill-" + form.patient_id + ".pdf");
};

return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-5xl font-bold text-blue-700 mb-8">
        Billing Dashboard
      </h1>

      <form
        onSubmit={generateBill}
        className="bg-white p-8 rounded-3xl shadow space-y-5"
      >
        <input
          className="w-full border rounded-xl p-4"
          placeholder="Patient ID"
          value={form.patientId}
          onChange={(e) => {
            const id = e.target.value;
            setForm({ ...form, patientId: id });
            getPatient(id);
          }}
        />

        <input
          className="w-full border rounded-xl p-4 bg-gray-100"
          placeholder="Patient Name"
          value={form.patientName}
          readOnly
        />

        <input
          className="w-full border rounded-xl p-4"
          placeholder="Medicine Name"
          value={form.medicineName}
          onChange={(e) =>
            setForm({ ...form, medicineName: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="border rounded-xl p-4"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="number"
            className="border rounded-xl p-4"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
        </div>

        <div className="bg-blue-50 rounded-xl p-5 text-2xl font-bold">
          Total: ₹{Number(form.quantity) * Number(form.price || 0)}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold"
        >
          Generate Bill
        </button>
      <button
  type="button"
          onClick={downloadPDF}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-4"
        >
          Print / Download PDF
        </button>

</form>

      <div className="mt-10 bg-white rounded-3xl shadow p-6">
        <h2 className="text-2xl font-bold mb-5">Recent Bills</h2>

        {bills.map((bill) => (
          <div
            key={bill.id}
            className="border-b py-4 flex justify-between"
          >
            <div>
              <h3 className="font-bold">{bill.patient_name}</h3>
              <p>{bill.medicine_name}</p>
              <p>{bill.quantity} × ₹{bill.price}</p>
            </div>

            <div className="text-right">
              <h3 className="font-bold text-green-600">
                ₹{bill.total_amount}
              </h3>
              <p>{bill.bill_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}








