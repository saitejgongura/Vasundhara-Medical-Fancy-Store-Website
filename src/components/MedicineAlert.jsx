const medicines = [
  ["Paracetamol","12 Left","bg-red-500 w-1/4"],
  ["Amoxicillin","25 Left","bg-orange-500 w-2/5"],
  ["ORS Packets","8 Left","bg-red-600 w-1/5"],
  ["Vitamin B12","50 Left","bg-green-600 w-3/4"]
];

export default function MedicineAlert() {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h2 className="text-xl font-bold mb-5 text-slate-800">
        Medicine Stock Alert
      </h2>

      {medicines.map((m) => (
        <div key={m[0]} className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>{m[0]}</span>
            <span>{m[1]}</span>
          </div>

          <div className="bg-slate-200 rounded-full h-2">
            <div className={`${m[2]} h-2 rounded-full`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

