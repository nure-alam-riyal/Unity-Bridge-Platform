const UpdateCard = ({ update }) => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow flex gap-5">
      <img
        src={update.image}
        alt=""
        className="w-32 h-32 rounded-2xl object-cover"
      />

      <div>
        <div className="flex justify-between items-center">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {update.category}
          </span>

          <span className="text-gray-400 text-sm">
            {update.time}
          </span>
        </div>

        <h3 className="font-bold text-2xl mt-3">
          {update.title}
        </h3>

        <p className="text-gray-500 mt-3">
          {update.description}
        </p>
      </div>
    </div>
  );
};

export default UpdateCard;