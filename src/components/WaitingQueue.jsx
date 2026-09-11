const queue = [
  ["12","Ravi Kumar"],
  ["13","Sunitha"],
  ["14","Mahesh"],
  ["15","Priya"]
];

export default function WaitingQueue() {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <h2 className="text-xl font-bold mb-5 text-slate-800">
        Waiting Queue
      </h2>

      {queue.map((item) => (
        <div key={item[0]} className="flex justify-between items-center border-b py-3 last:border-none">
          <div>
            <p className="font-semibold">{item[1]}</p>
            <p className="text-sm text-slate-500">
              Token #{item[0]}
            </p>
          </div>

          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            Waiting
          </span>
        </div>
      ))}
    </div>
  );
}

