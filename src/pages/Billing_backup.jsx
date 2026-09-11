import { useEffect, useMemo, useState } from "react";
import supabase from "../services/supabase";
import BillReceipt from "../components/BillReceipt";

export default function Billing() {
  const [patients, setPatients] = useState([]);
  const [recentBills, setRecentBills] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  const [consultationFee, setConsultationFee] = useState(200);
  const [medicineFee, setMedicineFee] = useState(0);
  const [otherFee, setOtherFee] = useState(0);

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [availableMedicines, setAvailableMedicines] = useState([]);
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

  async function fetchBills() {
    const { data } = await supabase
      .from("billing")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentBills(data || []);
  }

  
async function fetchMedicines() {
  const { data } = await supabase
    .from("medicines")
    .select("*")
    .order("medicine_name");

  setAvailableMedicines(data || []);
}


async function fetchMedicines() {
  const { data } = await supabase
    .from("medicines")
    .select("*")
    .order("medicine_name");

  setAvailableMedicines(data || []);
}


async function fetchMedicines() {
  const { data } = await supabase
    .from("medicines")
    .select("*")
    .order("medicine_name");

  setAvailableMedicines(data || []);
}


async function fetchMedicines() {
  const { data } = await supabase
    .from("medicines")
    .select("*")
    .order("medicine_name");

  setAvailableMedicines(data || []);
}

const totalAmount = useMemo(() => {
    return (
      Number(consultationFee) +
      Number(medicineFee) +
      Number(otherFee)
    );
  }, [consultationFee, medicineFee, otherFee]);

  const billNumber = `BILL-${Date.now().toString().slice(-6)}`;

  async function handlePatientChange(value) {
    setSelectedPatient(value);

    if (!value) {
      setMedicineFee(0);
      setSelectedMedicines([]);
      return;
    }

    const { data } = await supabase
      .from("patients")
      .select("medicines")
      .eq("id", value)
      .single();

    const meds = data?.medicines || [];

    setSelectedMedicines(meds);

    const totalMedicinePrice = meds.reduce(
      (sum, med) => sum + Number(med.price || 0),
      0
    );

    setMedicineFee(totalMedicinePrice);
  }

  
function addBillMedicine() {
  setBillMedicines([...billMedicines,{id:"",qty:1,total:0}]);
}

function removeBillMedicine(index) {
  setBillMedicines(billMedicines.filter((_,i)=>i!==index));
}

function updateBillMedicine(index,field,value) {
  const copy=[...billMedicines];
  copy[index][field]=value;

  const med=availableMedicines.find(m=>m.id===Number(copy[index].id));

  if(med){
    copy[index].total=med.price*Number(copy[index].qty||1);
  }

  setBillMedicines(copy);

  setMedicineFee(copy.reduce((s,m)=>s+Number(m.total),0));
}

async function saveBill(e) {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select patient.");
      return;
    }

    const patient = patients.find(
      (p) => p.id === Number(selectedPatient)
    );

    const { error } = await supabase.from("billing").insert([
      {
        bill_number: billNumber,
        patient_id: patient.patient_id,
        patient_name: patient.full_name,

        consultation_fee: Number(consultationFee),
        medicine_fee: Number(medicineFee),
        other_fee: Number(otherFee),

        total_amount: totalAmount,
        payment_mode: paymentMode,

        medicines: selectedMedicines,
      },
    ]);

    if (error) {
      alert("Bill Save Failed");
      return;
    }

    alert("Bill Saved Successfully");

    setSelectedPatient("");
    setSelectedMedicines([]);
    setConsultationFee(200);
    setMedicineFee(0);
    setOtherFee(0);
    setPaymentMode("Cash");

    fetchBills();   fetchMedicines();  fetchMedicines();  fetchMedicines();
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
        {/* Left Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-5">
          <h2 className="text-2xl font-bold text-blue-700">
            Create New Bill
          </h2>

          <div>
            <label className="font-semibold">Patient</label>

            <select
              value={selectedPatient}
              onChange={(e) => handlePatientChange(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
            >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.patient_id} — {patient.full_name}
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
              onChange={(e) => setConsultationFee(e.target.value)}
              className="w-full border rounded-xl p-4 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Medicine Charges
            </label>

            <input
              type="number"
              value={medicineFee}
              readOnly
              className="w-full border rounded-xl p-4 mt-2 bg-slate-100"
            />
          </div>

          <div>
            <label className="font-semibold">Other Charges</label>

            <input
              type="number"
              value={otherFee}
              onChange={(e) => setOtherFee(e.target.value)}
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg"
          >
            Save Bill
          </button>
        </div>

        {/* Invoice Preview */}
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
              <span>₹{medicineFee}</span>
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
          </div>

          {/* Selected Medicines */}
          {selectedMedicines.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg text-blue-700 mb-3">
                Medicines Included
              </h3>

              <div className="space-y-2">
                {selectedMedicines.map((med, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-white rounded-lg p-3"
                  >
                    <span>{med.name}</span>
                    <span className="font-semibold">
                      ₹{med.price || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Recent Bills */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mt-10">
        <h2 className="text-2xl font-bold text-blue-700 mb-5">
          Recent Bills
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left p-3">Bill</th>
                <th className="text-left p-3">Patient</th>
                <th className="text-center p-3">Payment</th>
                <th className="text-center p-3">Amount</th>
                <th className="text-center p-3">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {recentBills.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-500"
                  >
                    No bills available.
                  </td>
                </tr>
              ) : (
                recentBills.map((bill) => (
                  <tr
                    key={bill.bill_number}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="p-3 font-semibold">
                      {bill.bill_number}
                    </td>

                    <td className="p-3">
                      {bill.patient_name}
                    </td>

                    <td className="text-center">
                      {bill.payment_mode}
                    </td>

                    <td className="text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                        ₹{bill.total_amount}
                      </span>
                    </td>

                    <td className="text-center">
                      <BillReceipt bill={bill} />
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

















