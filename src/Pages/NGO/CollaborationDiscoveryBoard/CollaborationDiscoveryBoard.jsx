// src/pages/CollaborationDiscoveryBoard.jsx

import { useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Bookmark, Search, Filter, MapPin, Handshake } from "lucide-react";

// ---------------- MOCK DATA ----------------

const ngoData = [
  {
    id: 1,
    name: "EduReach Global",
    region: "Africa",
    location: "Nairobi, Kenya",
    category: "Education",
    verified: true,
    partnership: true,
    description:
      "Providing digital literacy and STEM education infrastructure to under-resourced schools.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "MediFrontiers",
    region: "Europe",
    location: "Geneva, Switzerland",
    category: "Healthcare",
    verified: true,
    partnership: false,
    description:
      "Delivering mobile clinic infrastructure and telemedicine solutions to remote communities.",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Green Canopy Initiative",
    region: "South America",
    location: "Amazon Basin, Brazil",
    category: "Climate",
    verified: false,
    partnership: true,
    description:
      "Focused on rapid reforestation and indigenous land rights support.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
  },
];

// ---------------- REDUX ----------------

const discoverySlice = createSlice({
  name: "discovery",
  initialState: {
    search: "",
    region: "",
    category: "",
    saved: [],
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    toggleSave: (state, action) => {
      if (state.saved.includes(action.payload)) {
        state.saved = state.saved.filter((id) => id !== action.payload);
      } else {
        state.saved.push(action.payload);
      }
    },
  },
});

const {
  setSearch,
  setRegion,
  setCategory,
  toggleSave,
} = discoverySlice.actions;

const store = configureStore({
  reducer: {
    discovery: discoverySlice.reducer,
  },
});

// ---------------- CARD ----------------

function NGOCard({ ngo }) {
  const dispatch = useDispatch();
  const saved = useSelector((state) =>
    state.discovery.saved.includes(ngo.id)
  );

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden">
        <img
          src={ngo.image}
          alt={ngo.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4">
          {ngo.verified ? (
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
              Verified
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              Pending
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-bold">{ngo.name}</h2>

          <div className="mt-1 flex items-center gap-1 text-sm text-gray-200">
            <MapPin size={15} />
            {ngo.location}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-gray-600">
          {ngo.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {ngo.category}
          </span>

          {ngo.partnership && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              <Handshake size={13} />
              Open to Partnerships
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Collaboration Request
          </button>

          <button
            onClick={() => dispatch(toggleSave(ngo.id))}
            className={`rounded-xl border p-2 transition ${
              saved
                ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- MAIN CONTENT ----------------

function DiscoveryContent() {
  const dispatch = useDispatch();

  const { search, region, category } = useSelector(
    (state) => state.discovery
  );

  const filteredNGOs = ngoData.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.description.toLowerCase().includes(search.toLowerCase());

    const matchesRegion = region ? ngo.region === region : true;

    const matchesCategory = category
      ? ngo.category === category
      : true;

    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Collaboration Discovery Board
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Discover verified NGOs, nonprofit organizations, and
            impact-driven partners across education, healthcare,
            sustainability, and humanitarian sectors.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search organizations..."
                value={search}
                onChange={(e) =>
                  dispatch(setSearch(e.target.value))
                }
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500"
              />
            </div>

            {/* REGION */}
            <select
              value={region}
              onChange={(e) =>
                dispatch(setRegion(e.target.value))
              }
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Europe">Europe</option>
              <option value="South America">
                South America
              </option>
            </select>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) =>
                dispatch(setCategory(e.target.value))
              }
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Climate">Climate</option>
            </select>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              <Filter size={18} />
              More Filters
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredNGOs.map((ngo) => (
            <NGOCard key={ngo.id} ngo={ngo} />
          ))}
        </div>

        {filteredNGOs.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No organizations found
            </h3>

            <p className="mt-2 text-gray-500">
              Try adjusting your filters or search keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- PAGE EXPORT ----------------

export default function CollaborationDiscoveryBoard() {
  return (
    <Provider store={store}>
      <DiscoveryContent />
    </Provider>
  );
}