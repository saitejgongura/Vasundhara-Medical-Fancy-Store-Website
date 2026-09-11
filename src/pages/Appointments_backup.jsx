import Sidebar from "../components/Sidebar";

export default function Appointments() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-gray-500">Appointment Management Page</p>
      </div>
    </div>
  );
}

