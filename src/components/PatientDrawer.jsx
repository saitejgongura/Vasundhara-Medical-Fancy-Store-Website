import { X, Phone, HeartPulse, Droplet, Weight } from "lucide-react";

export default function PatientDrawer({ open, onClose, patient }) {
  if (!open || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

      <div className="w-[420px] bg-white h-screen shadow-2xl p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Patient Details</h2>

          <button onClick={onClose}>
            <X size={24}/>
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {patient.name[0]}
          </div>

          <h3 className="text-xl font-bold mt-3">{patient.name}</h3>

          <p className="text-gray-500">{patient.id}</p>
        </div>

        <div className="space-y-4">

          <div className="flex justify-between border-b pb-2">
            <span>Age</span>
            <span className="font-semibold">{patient.age}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Gender</span>
            <span className="font-semibold">{patient.gender}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Village</span>
            <span className="font-semibold">{patient.village}</span>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <span className="flex gap-2 items-center">
              <Phone size={18}/> Phone
            </span>

            <span className="font-semibold">{patient.phone}</span>
          </div>

        </div>

        <h3 className="text-lg font-bold mt-8 mb-4">
          Today's Vitals
        </h3>

        <div className="grid grid-cols-2 gap-3">

          <div className="bg-red-50 rounded-xl p-4">
            <HeartPulse className="text-red-600 mb-2"/>
            <p className="text-sm">BP</p>
            <h4 className="font-bold text-xl">120/80</h4>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <Droplet className="text-yellow-600 mb-2"/>
            <p className="text-sm">Sugar</p>
            <h4 className="font-bold text-xl">105 mg/dL</h4>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <Weight className="text-green-600 mb-2"/>
            <p className="text-sm">Weight</p>
            <h4 className="font-bold text-xl">68 kg</h4>
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            ???
            <p className="text-sm mt-2">Temperature</p>
            <h4 className="font-bold text-xl">98.6°F</h4>
          </div>

        </div>

        <h3 className="text-lg font-bold mt-8 mb-3">
          Previous Visits
        </h3>

        <div className="space-y-3">
          <div className="bg-slate-100 rounded-xl p-3">
            <p className="font-semibold">02 Sep 2026</p>
            <p className="text-sm text-gray-600">
              Fever • Paracetamol prescribed
            </p>
          </div>

          <div className="bg-slate-100 rounded-xl p-3">
            <p className="font-semibold">28 Aug 2026</p>
            <p className="text-sm text-gray-600">
              BP Follow-up • BP Normal
            </p>
          </div>

          <div className="bg-slate-100 rounded-xl p-3">
            <p className="font-semibold">15 Aug 2026</p>
            <p className="text-sm text-gray-600">
              Diabetes Checkup
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

