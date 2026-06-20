const StatsCard = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="col-span-2 bg-gradient-to-r from-white to-green-100 p-8 rounded-3xl shadow">
        <p className="uppercase text-gray-500 font-semibold">
          Lifetime Global Impact
        </p>

        <h2 className="text-6xl font-bold text-green-700 mt-3">
          $42,500
        </h2>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-2xl">
            <p className="text-gray-500">Clean Water Wells</p>
            <h3 className="text-3xl font-bold">12</h3>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            <p className="text-gray-500">Children Educated</p>
            <h3 className="text-3xl font-bold">350+</h3>
          </div>

          <div className="bg-white p-4 rounded-2xl">
            <p className="text-gray-500">Trees Planted</p>
            <h3 className="text-3xl font-bold">1.2k</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow">
        <div className="flex justify-between">
          <p className="uppercase text-gray-500 font-semibold">
            Latest Contribution
          </p>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            Processed
          </span>
        </div>

        <h2 className="text-5xl font-bold mt-6">$500</h2>

        <p className="mt-4 text-lg">
          Haiti Earthquake Relief Fund
        </p>

        <p className="text-gray-500 mt-2">
          Oct 24, 2024
        </p>

        <button className="text-green-700 mt-8 font-semibold">
          View Receipt →
        </button>
      </div>
    </div>
  );
};

export default StatsCard;