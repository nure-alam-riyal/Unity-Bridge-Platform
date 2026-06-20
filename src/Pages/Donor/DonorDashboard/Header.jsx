const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-5xl font-bold">
          Welcome back, Sarah
        </h1>

        <p className="text-gray-500 mt-2">
          Here is your impact overview and recent activities.
        </p>
      </div>

      <div className="flex gap-4">
        <button className="border px-5 py-3 rounded-xl bg-white">
          Tax Receipts
        </button>

        <button className="bg-green-700 text-white px-5 py-3 rounded-xl">
          Donate Now
        </button>
      </div>
    </div>
  );
};

export default Header;