import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

/* =========================
   Redux Slice
========================= */

const ngoProfileSlice = createSlice({
  name: "ngoProfile",
  initialState: {
    organizationName: "",
    missionStatement: "",
    selectedSdgs: [3, 6],
    uploadedFiles: [
      {
        id: 1,
        name: "registration_certificate_2023.pdf",
      },
    ],
  },
  reducers: {
    setOrganizationName: (state, action) => {
      state.organizationName = action.payload;
    },

    setMissionStatement: (state, action) => {
      state.missionStatement = action.payload;
    },

    toggleSdg: (state, action) => {
      const value = action.payload;

      if (state.selectedSdgs.includes(value)) {
        state.selectedSdgs = state.selectedSdgs.filter(
          (item) => item !== value
        );
      } else {
        if (state.selectedSdgs.length < 3) {
          state.selectedSdgs.push(value);
        }
      }
    },

    addFiles: (state, action) => {
      const files = action.payload.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
      }));

      state.uploadedFiles.push(...files);
    },

    removeFile: (state, action) => {
      state.uploadedFiles = state.uploadedFiles.filter(
        (file) => file.id !== action.payload
      );
    },
  },
});

export const {
  setOrganizationName,
  setMissionStatement,
  toggleSdg,
  addFiles,
  removeFile,
} = ngoProfileSlice.actions;

/* =========================
   Store
========================= */

export const store = configureStore({
  reducer: {
    ngoProfile: ngoProfileSlice.reducer,
  },
});

/* =========================
   Constants
========================= */

const sdgs = [
  { id: 1, label: "No Poverty" },
  { id: 2, label: "Zero Hunger" },
  { id: 3, label: "Good Health" },
  { id: 4, label: "Quality Education" },
  { id: 5, label: "Gender Equality" },
  { id: 6, label: "Clean Water" },
];

/* =========================
   Component
========================= */

export default function NGOProfileSetupPage() {
  const dispatch = useDispatch();

  const {
    organizationName,
    missionStatement,
    selectedSdgs,
    uploadedFiles,
  } = useSelector((state) => state.ngoProfile);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    dispatch(addFiles(files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      organizationName,
      missionStatement,
      selectedSdgs,
      uploadedFiles,
    });
  };

  return (
    <div className="min-h-screen bg-[#f4fbf4] text-[#161d19]">
      <main className="w-full max-w-3xl mx-auto px-4 md:px-6 py-10 flex flex-col">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-[#006c49] mb-2">
            NGO Profile Setup
          </h1>

          <p className="text-lg text-[#3c4a42]">
            Complete your profile to unlock full platform features and build
            trust with donors.
          </p>

          {/* Progress */}
          <div className="mt-8 flex items-center justify-between relative max-w-md mx-auto">
            <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#dde4dd]" />

            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#006c49] w-1/3" />

            {["Identity", "Mission", "Docs", "Team"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center gap-1 z-10"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index === 0
                        ? "bg-[#006c49] text-white"
                        : "bg-[#dde4dd] text-[#3c4a42]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      index === 0
                        ? "text-[#006c49]"
                        : "text-[#3c4a42]"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              )
            )}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mission Section */}
          <section className="bg-white rounded-2xl border border-[#bbcabf] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-outlined text-[#006c49]">
                flag
              </span>

              <h2 className="text-2xl font-semibold">
                Organizational Mission
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Organization Name
                </label>

                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) =>
                    dispatch(setOrganizationName(e.target.value))
                  }
                  placeholder="Enter your registered name"
                  className="w-full rounded-lg border border-[#bbcabf] bg-[#f4fbf4] px-4 py-3 outline-none focus:border-[#4059aa] focus:ring-2 focus:ring-[#006c49]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mission Statement
                </label>

                <textarea
                  rows={4}
                  value={missionStatement}
                  onChange={(e) =>
                    dispatch(setMissionStatement(e.target.value))
                  }
                  placeholder="Briefly describe your organization's core purpose and goals..."
                  className="w-full rounded-lg border border-[#bbcabf] bg-[#f4fbf4] px-4 py-3 outline-none focus:border-[#4059aa] focus:ring-2 focus:ring-[#006c49]/20"
                />
              </div>
            </div>
          </section>

          {/* SDGs */}
          <section className="bg-white rounded-2xl border border-[#bbcabf] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-outlined text-[#006c49]">
                public
              </span>

              <h2 className="text-2xl font-semibold">
                Focus Areas (SDGs)
              </h2>
            </div>

            <p className="text-[#3c4a42] mb-5">
              Select up to 3 Sustainable Development Goals your work primarily
              aligns with.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sdgs.map((sdg) => {
                const active = selectedSdgs.includes(sdg.id);

                return (
                  <button
                    key={sdg.id}
                    type="button"
                    onClick={() => dispatch(toggleSdg(sdg.id))}
                    className={`flex items-center rounded-xl border p-4 transition-all ${
                      active
                        ? "border-[#006c49] bg-[#006c49]/5"
                        : "border-[#bbcabf] hover:bg-[#eef6ee]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                        active
                          ? "bg-[#006c49] border-[#006c49]"
                          : "border-[#6c7a71]"
                      }`}
                    >
                      {active && (
                        <span className="material-symbols-outlined text-white text-sm">
                          check
                        </span>
                      )}
                    </div>

                    <span className="font-medium">{sdg.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Legal Docs */}
          <section className="bg-white rounded-2xl border border-[#bbcabf] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006c49]">
                  description
                </span>

                <h2 className="text-2xl font-semibold">
                  Legal Documentation
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4059aa]/10 border border-[#4059aa]/20">
                <div className="w-2 h-2 rounded-full bg-[#4059aa] animate-pulse" />

                <span className="text-xs font-semibold uppercase tracking-wide text-[#4059aa]">
                  Pending Verification
                </span>
              </div>
            </div>

            <p className="text-[#3c4a42] mb-5">
              Upload relevant documents to achieve verified status.
            </p>

            <label className="border-2 border-dashed border-[#bbcabf] rounded-xl p-10 text-center bg-[#f4fbf4] hover:bg-[#eef6ee] transition-colors cursor-pointer block">
              <span className="material-symbols-outlined text-5xl text-[#6c7a71] mb-3 block">
                cloud_upload
              </span>

              <p className="font-semibold mb-1">
                Drag and drop files here
              </p>

              <p className="text-sm text-[#3c4a42] mb-4">
                or click to browse (PDF, JPG, PNG)
              </p>

              <div className="inline-flex items-center px-4 py-2 rounded-lg border border-[#bbcabf] bg-white hover:bg-[#eef6ee]">
                Select Files
              </div>

              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            {/* File List */}
            <div className="mt-5 space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#f4fbf4] border border-[#bbcabf]"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4059aa]">
                      picture_as_pdf
                    </span>

                    <span className="truncate max-w-[220px] sm:max-w-xs">
                      {file.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch(removeFile(file.id))}
                    className="text-red-500 hover:bg-red-100 rounded-full p-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#bbcabf]">
            <button
              type="button"
              className="px-6 py-3 rounded-lg border border-[#4059aa] text-[#4059aa] font-semibold hover:bg-[#4059aa]/10 transition-colors"
            >
              Save Draft
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#006c49] text-white font-semibold hover:bg-[#005236] transition-colors shadow-sm"
            >
              Continue to Team

              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}