export default function ClinicStatus() {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h2 className="text-xl font-bold mb-5 text-slate-800">
        Clinic Status
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between">
          <span className="text-gray-600">Clinic</span>
          <span className="text-green-600 font-semibold">Open</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Doctor Available</span>
          <span className="text-blue-600 font-semibold">Yes</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Patients Waiting</span>
          <span className="font-bold text-orange-500">4</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Next Appointment</span>
          <span className="font-semibold">11:00 AM</span>
        </div>

      </div>
    </div>
  );
}

