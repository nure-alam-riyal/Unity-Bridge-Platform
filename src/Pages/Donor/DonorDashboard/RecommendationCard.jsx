const RecommendationCard = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        alt=""
        className="h-56 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-bold">
          Clean Water for Rural Uganda
        </h3>

        <p className="text-gray-500 mt-3">
          Help us finish this vital well.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-5">
          <div className="bg-green-700 h-3 rounded-full w-[85%]"></div>
        </div>

        <button className="w-full border border-green-700 text-green-700 py-3 rounded-xl mt-6">
          Review Project
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;