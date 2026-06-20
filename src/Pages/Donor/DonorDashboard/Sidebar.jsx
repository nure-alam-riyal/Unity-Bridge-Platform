import {
  FaChartBar,
  FaHandsHelping,
  FaProjectDiagram,
  FaUsers,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-sidebar text-white h-screen flex flex-col justify-between p-4">
      <div>
        <h1 className="text-3xl font-bold text-green-400 mb-8">
          UnityBridge
        </h1>

        <div className="bg-gray-700 rounded-xl p-3 mb-8">
          <h2 className="font-semibold">Sarah Jenkins</h2>
          <p className="text-sm text-gray-300">Verified Donor</p>
        </div>

        <nav className="space-y-2">
          <div className="bg-green-500 text-black px-4 py-3 rounded-xl flex items-center gap-3">
            <FaChartBar />
            Dashboard
          </div>

          <div className="px-4 py-3 rounded-xl hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
            <FaChartBar />
            Impact Tracking
          </div>

          <div className="px-4 py-3 rounded-xl hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
            <FaProjectDiagram />
            Project Manager
          </div>

          <div className="px-4 py-3 rounded-xl hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
            <FaHandsHelping />
            Donor Relations
          </div>

          <div className="px-4 py-3 rounded-xl hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
            <FaUsers />
            Volunteer Hub
          </div>
        </nav>
      </div>

      <div className="space-y-2">
        <button className="w-full bg-green-700 hover:bg-green-800 py-3 rounded-xl font-semibold">
          Launch Project
        </button>

        <div className="px-4 py-3 rounded-xl hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
          <FaCog />
          Settings
        </div>

        <div className="px-4 py-3 rounded-xl hover:bg-gray-700 flex items-center gap-3 cursor-pointer">
          <FaQuestionCircle />
          Support
        </div>
      </div>
    </div>
  );
};

export default Sidebar;