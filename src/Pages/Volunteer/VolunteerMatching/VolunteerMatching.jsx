// src/pages/VolunteerMatching.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bookmark,
  BookmarkCheck,
  Search,
  MapPin,
  Calendar,
  Clock3,
  School,
  Wifi,
  Moon,
  SlidersHorizontal,
  LocateFixed,
  Plus,
  Minus,
} from "lucide-react";
import { toggleBookmark } from "../redux/slices/volunteerSlice";

const VolunteerMatching = () => {
  const dispatch = useDispatch();
  const { opportunities } = useSelector((state) => state.volunteer);

  const [selectedId, setSelectedId] = useState(1);

  return (
    <div className="bg-[#f4fbf4] min-h-screen overflow-hidden text-[#161d19]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#bbcabf] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-emerald-700">
            UnityBridge
          </h1>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-gray-600 hover:text-emerald-700">
              Projects
            </a>

            <a
              href="#"
              className="border-b-2 border-emerald-700 pb-1 font-semibold text-emerald-700"
            >
              Volunteer
            </a>

            <a href="#" className="text-gray-600 hover:text-emerald-700">
              Transparency
            </a>

            <a href="#" className="text-gray-600 hover:text-emerald-700">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-64 rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <button className="hidden rounded-full border border-indigo-500 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:block">
              Sign In
            </button>

            <button className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-800">
              Donate Now
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex h-screen pt-16">
        {/* Left Panel */}
        <section className="w-full border-r border-[#bbcabf] bg-white lg:w-[40%] xl:w-[33%]">
          {/* Header */}
          <div className="border-b border-[#bbcabf] bg-white p-5">
            <h2 className="text-2xl font-bold">
              Volunteer Matching Engine
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Find where your skills meet the greatest need.
            </p>

            {/* Filters */}
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              <FilterButton
                active
                icon={<SlidersHorizontal size={14} />}
                text="All Skills"
              />

              <FilterButton
                icon={<Calendar size={14} />}
                text="Weekends"
              />

              <FilterButton
                icon={<LocateFixed size={14} />}
                text="Within 10km"
              />

              <FilterButton
                icon={<School size={14} />}
                text="Medical"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="h-[calc(100vh-170px)] overflow-y-auto space-y-4 bg-[#f4fbf4] p-5">
            {opportunities.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  selectedId === item.id
                    ? "border-emerald-600"
                    : "border-[#dde4dd]"
                }`}
              >
                {/* Top */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {item.badge && (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          {item.badge}
                        </span>
                      )}

                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                        Verified NGO
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.organization}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(toggleBookmark(item.id));
                    }}
                    className="text-gray-500 transition hover:text-emerald-700"
                  >
                    {item.bookmarked ? (
                      <BookmarkCheck size={22} />
                    ) : (
                      <Bookmark size={22} />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {item.tags.map((tag, idx) => (
                    <Tag key={idx} icon={tag.icon} text={tag.text} />
                  ))}
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-gray-500">
                    {item.status}
                  </span>

                  <button className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Panel */}
        <section className="relative hidden flex-1 overflow-hidden bg-[#dde4dd] lg:block">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2070&auto=format&fit=crop"
            alt="map"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-emerald-900/5" />

          {/* Controls */}
          <div className="absolute right-5 top-5 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            <MapControl icon={<Plus size={18} />} />
            <MapControl icon={<Minus size={18} />} />
            <MapControl icon={<LocateFixed size={18} />} />
          </div>

          {/* Active Pin */}
          <div className="absolute left-1/4 top-1/3">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-30" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-emerald-700 shadow-2xl">
                <School className="text-white" size={20} />
              </div>

              <div className="absolute -top-28 left-1/2 w-56 -translate-x-1/2 rounded-2xl border bg-white p-4 shadow-xl">
                <h4 className="font-bold">
                  {opportunities.find((o) => o.id === selectedId)?.title}
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  {
                    opportunities.find((o) => o.id === selectedId)
                      ?.organization
                  }
                </p>

                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span className="text-xs font-semibold text-emerald-700">
                    Volunteers Needed
                  </span>

                  <span className="text-sm">→</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VolunteerMatching;

/* -------------------------------- Components -------------------------------- */

const FilterButton = ({ icon, text, active }) => (
  <button
    className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-emerald-600 text-white"
        : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {icon}
    {text}
  </button>
);

const Tag = ({ icon, text }) => (
  <div className="flex items-center gap-2 rounded-lg bg-[#eef6ee] px-3 py-1.5 text-xs text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
);

const MapControl = ({ icon }) => (
  <button className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100">
    {icon}
  </button>
);