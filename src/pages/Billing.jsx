import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import BillReceipt from "../components/BillReceipt";

export default function Billing() {
  const [patients, setPatients] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [consultationFee, setConsultationFee] = useState(200);
  const [otherFee, setOtherFee] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");

  const [billMedicines, setBillMedicines] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchBills();
    fetchMedicines();
  }, []);

  async function fetchPatients() {
    const { data } = await supabase
      .from("patients")
      .select("id, patient_id, full_name")
      .order("full_name");

    setPatients(data || []);
  }

  async function fetchMedicines() {
    const { data } = await supabase
      .from("medicines")
      .select("*")
      .order("medicine_name");

    setAvailableMedicines(data || []);
  }

  async function fetchBills() {
    const { data } = await supabase
      .from("billing")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentBills(data || []);
  }

  const medicinesTotal = useMemo(() => {
    return billMedicines.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [billMedicines]);

  async function deleteBill(id) {
    const ok = window.confirm("Delete this bill?");
    if (!ok) return;

    await supabase.from("billing").delete().eq("id", id);
    fetchBills();
  }

  const totalAmount = useMemo(() => {
    return Number(consultationFee) + Number(otherFee) + medicinesTotal;
  }, [consultationFee, otherFee, medicinesTotal]);

  const selectedPatientData = patients.find((p) => p.id === Number(selectedPatient));
  const billNumber = selectedPatientData ? selectedPatientData.patient_id : "";

  function addMedicineRow() {
    setBillMedicines([
      ...billMedicines,
      { id: "", name: "", price: 0, qty: 1 },
    ]);
  }

  function selectMedicine(index, id) {
    const med = availableMedicines.find((m) => m.id === Number(id));
    if (!med) return;

    const copy = [...billMedicines];
    copy[index] = {
      id: med.id,
      name: med.medicine_name,
      price: Number(med.price),
      qty: 1,
    };
    setBillMedicines(copy);
  }

  function changeQty(index, qty) {
    const copy = [...billMedicines];
    copy[index].qty = Number(qty);
    setBillMedicines(copy);
  }

  function removeMedicine(index) {
    setBillMedicines(billMedicines.filter((_, i) => i !== index));
  }

  async function saveBill(e) {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Select patient");
      return;
    }

    const patient = patients.find(
      (p) => p.id === Number(selectedPatient)
    );

    const { error } = await supabase.from("billing").insert([
      {
        bill_number: `BILL-${patient.patient_id}`,
        patient_id: patient.patient_id,
        patient_name: patient.full_name,
        consultation_fee: consultationFee,
        medicine_fee: medicinesTotal,
        other_fee: otherFee,
        total_amount: totalAmount,
        payment_mode: paymentMode,
        medicines: billMedicines,
      },
    ]);

    if (error) { console.log(error); alert(error.message); return;}

    for (const item of billMedicines) {
      const med = availableMedicines.find((m) => m.id === item.id);

      if (med) {
        await supabase
          .from("medicines")
          .update({ stock: med.stock - item.qty })
          .eq("id", med.id);
      }
    }

    alert("Bill Saved Successfully");

    setSelectedPatient("");
    setConsultationFee(200);
    setOtherFee(0);
    setPaymentMode("Cash");
    setBillMedicines([]);

    fetchBills();
    fetchMedicines();
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-5xl font-bold text-blue-700 mb-8">
        Billing Dashboard
      </h1>

      <form
        onSubmit={saveBill}
        className="grid lg:grid-cols-2 gap-8"
      >
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-5">
          <h2 className="text-2xl font-bold text-blue-700">
            Create New Bill
          </h2>

          <div>
            <label className="font-semibold">Patient</label>

            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
            >
              <option value="">Select Patient</option>

              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.patient_id} — {p.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">
              Consultation Fee
            </label>

            <input
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(Number(e.target.value))}
              className="w-full border rounded-xl p-4 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold text-lg">
              Medicines
            </label>

            {billMedicines.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 mt-3 items-center"
              >
                <select
                  value={item.id}
                  onChange={(e) =>
                    selectMedicine(index, e.target.value)
                  }
                  className="col-span-6 border rounded-xl p-3"
                >
                  <option value="">Select Medicine</option>

                  {availableMedicines.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.medicine_name} — ₹{med.price}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) =>
                    changeQty(index, e.target.value)
                  }
                  className="col-span-2 border rounded-xl p-3 text-center"
                />

                <div className="col-span-2 font-bold text-green-600">
                  ₹{item.price * item.qty}
                </div>

                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="col-span-2 bg-red-500 text-white rounded-xl p-3"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addMedicineRow}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl"
            >
              + Add Medicine
            </button>
          </div>

          <div>
            <label className="font-semibold">Other Charges</label>

            <input
              type="number"
              value={otherFee}
              onChange={(e) => setOtherFee(Number(e.target.value))}
              className="w-full border rounded-xl p-4 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">Payment Mode</label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            Save Bill
          </button>
        </div>

        <div className="bg-blue-50 rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-5">
            Invoice Preview
          </h2>

          <div className="space-y-3 text-lg">
            <div className="flex justify-between">
              <span>Bill Number</span>
              <span className="font-bold">{billNumber}</span>
            </div>

            <div className="flex justify-between">
              <span>Consultation</span>
              <span>₹{consultationFee}</span>
            </div>

            <div className="flex justify-between">
              <span>Medicines</span>
              <span>₹{medicinesTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Other Charges</span>
              <span>₹{otherFee}</span>
            </div>

            <hr />

            <div className="flex justify-between text-3xl font-bold text-green-600">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            {billMedicines.length > 0 && (
              <>
                <hr />
                <h3 className="font-bold text-blue-700">
                  Medicines Included
                </h3>

                {billMedicines.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-white rounded-xl p-3"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>

                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </form>

      {/* ================= RECENT BILLS ================= */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mt-10">
  <h2 className="text-2xl font-bold text-blue-700 mb-5">
    Recent Bills
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="p-3 text-left">Bill No</th>
          <th className="p-3 text-left">Patient</th>
          <th className="p-3 text-center">Payment</th>
          <th className="p-3 text-center">Amount</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {recentBills.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-8 text-gray-500">
              No Bills Available
            </td>
          </tr>
        ) : (
          recentBills.map((bill) => (
            <tr key={bill.id || bill.bill_number} className="border-b hover:bg-slate-50">
              <td className="p-3 font-bold text-blue-700">
                {bill.bill_number}
              </td>

              <td className="p-3">
                <div className="font-semibold">{bill.patient_name}</div>
                <div className="text-sm text-gray-500">ID: {bill.patient_id}</div>
              </td>

              <td className="p-3 text-center">{bill.payment_mode}</td>

              <td className="p-3 text-center">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                  ₹{bill.total_amount}
                </span>
              </td>

              <td className="p-3">
                <div className="flex gap-2 justify-center flex-wrap">
                  <BillReceipt bill={bill} />

                  <button
                    type="button"
                    onClick={() => navigate(`/edit-bill/${bill.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteBill(bill.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
}







