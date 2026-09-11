import { Printer, Phone, MapPin, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Prescription() {

  const printPDF = async () => {
    const input = document.getElementById("prescription");
    const canvas = await html2canvas(input,{scale:2});
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p","mm","a4");
    const width = 210;
    const height = canvas.height * width / canvas.width;

    pdf.addImage(img,"PNG",0,0,width,height);
    pdf.save("Gongura-Clinic-Prescription.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="flex justify-end mb-5">
        <button
          onClick={printPDF}
          className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Printer size={20}/>
          Print Prescription PDF
        </button>
      </div>

      <div id="prescription" className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="bg-blue-700 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Gongura Medical&Fancy Store</h1>
              <p className="text-blue-100 mt-2">RMP Clinic | General Physician</p>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16}/>
                  Nandyal, Andhra Pradesh
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16}/>
                  +91 9876543210
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16}/>
                  05 September 2026
                </div>
              </div>
            </div>

            <div className="w-24 h-24 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold">
              G
            </div>
          </div>
        </div>

        <div className="p-8">

          <div className="grid grid-cols-2 gap-5 mb-8">

            <div>
              <label className="text-gray-500 text-sm">Patient Name</label>
              <input defaultValue="Ramesh Kumar" className="w-full mt-2 border rounded-xl p-3"/>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Patient ID</label>
              <input defaultValue="GC0001" className="w-full mt-2 border rounded-xl p-3"/>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Age / Gender</label>
              <input defaultValue="32 Years / Male" className="w-full mt-2 border rounded-xl p-3"/>
            </div>

            <div>
              <label className="text-gray-500 text-sm">Village</label>
              <input defaultValue="Nandyal" className="w-full mt-2 border rounded-xl p-3"/>
            </div>

          </div>

          <h2 className="text-xl font-bold text-blue-700 mb-3">Symptoms</h2>

          <textarea
            defaultValue="Fever, Body Pain, Mild Cold and Headache."
            rows="3"
            className="w-full border rounded-xl p-4 mb-8"
          />

          <h2 className="text-xl font-bold text-blue-700 mb-4">Prescription</h2>

          <table className="w-full border border-gray-300 rounded-xl overflow-hidden mb-8">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-3 text-left">Medicine</th>
                <th className="p-3">Dosage</th>
                <th className="p-3">Days</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Paracetamol 650 mg</td>
                <td className="text-center">1 - 0 - 1</td>
                <td className="text-center">5 Days</td>
              </tr>

              <tr className="border-b">
                <td className="p-3">Cetirizine 10 mg</td>
                <td className="text-center">0 - 0 - 1</td>
                <td className="text-center">3 Days</td>
              </tr>

              <tr>
                <td className="p-3">ORS Powder</td>
                <td className="text-center">After Food</td>
                <td className="text-center">2 Days</td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-5 mb-8">

            <div className="bg-red-50 rounded-2xl p-5">
              <h3 className="font-bold text-red-600 mb-3">Vitals</h3>
              <p>BP : 120 / 80 mmHg</p>
              <p>Sugar : 105 mg/dL</p>
              <p>Weight : 68 Kg</p>
              <p>Temperature : 98.6 F</p>
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="font-bold text-green-700 mb-3">Doctor Advice</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Drink plenty of water.</li>
                <li>Take complete rest.</li>
                <li>Take medicines after food.</li>
                <li>Return if fever continues for 3 days.</li>
              </ul>
            </div>

          </div>

          <div className="flex justify-between items-end mt-12">

            <div>
              <p className="font-semibold">Next Visit</p>
              <p>10 September 2026</p>
            </div>

            <div className="text-right">
              <div className="w-48 border-t-2 border-black mb-2"></div>
              <p className="font-bold text-lg">Dr. Gongura (RMP)</p>
              <p className="text-sm text-gray-500">Doctor Signature</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

