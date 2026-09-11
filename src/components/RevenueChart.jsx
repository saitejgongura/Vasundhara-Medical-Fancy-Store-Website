export default function RevenueChart() {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        Weekly Patient Visits
      </h2>

      <svg viewBox="0 0 420 180" className="w-full">
        <polyline
          fill="none"
          stroke="#2563EB"
          strokeWidth="4"
          points="10,150 70,120 130,135 190,80 250,95 310,50 370,65 410,40"
        />

        <circle cx="10" cy="150" r="5" fill="#2563EB"/>
        <circle cx="70" cy="120" r="5" fill="#2563EB"/>
        <circle cx="130" cy="135" r="5" fill="#2563EB"/>
        <circle cx="190" cy="80" r="5" fill="#2563EB"/>
        <circle cx="250" cy="95" r="5" fill="#2563EB"/>
        <circle cx="310" cy="50" r="5" fill="#2563EB"/>
        <circle cx="370" cy="65" r="5" fill="#2563EB"/>
        <circle cx="410" cy="40" r="5" fill="#2563EB"/>
      </svg>

      <div className="flex justify-between text-sm text-slate-500 mt-4">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

