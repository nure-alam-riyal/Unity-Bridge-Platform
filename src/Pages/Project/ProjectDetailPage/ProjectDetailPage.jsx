import React, { useState } from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

// Redux slice (minimal for donation selection)
const donationSlice = createSlice({
  name: "donation",
  initialState: { amount: 50 },
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    donation: donationSlice.reducer,
  },
});

const { setAmount } = donationSlice.actions;

function DonationWidget() {
  const dispatch = useDispatch();
  const amount = useSelector((state) => state.donation.amount);
  const [custom, setCustom] = useState("");

  const preset = [25, 50, 100];

  return (
    <div className="bg-white border rounded-xl p-6 shadow-md sticky top-24">
      <h3 className="text-xl font-bold mb-2">Fuel the Impact</h3>
      <p className="text-gray-500 mb-4">100% of your donation goes directly to the field.</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {preset.map((p) => (
          <button
            key={p}
            onClick={() => dispatch(setAmount(p))}
            className={`py-2 rounded-lg border font-bold ${amount === p ? "bg-green-100 border-green-500" : ""}`}
          >
            ${p}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="Custom amount"
        className="w-full border rounded-lg p-2 mb-4"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
      />

      <button
        onClick={() => dispatch(setAmount(Number(custom || amount)))}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
      >
        Donate ${amount}
      </button>
    </div>
  );
}

function ProjectPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white border-b h-16 flex items-center px-6 z-50">
        <div className="font-bold text-green-600 text-xl">UnityBridge</div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative h-[500px]">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXG2mTyelg0RXMyyYhMy-lJQhKhgAQiDdyHWITqXWnWvkaVguygzJaDzGQkyf63jMDxwMm5OPTZzq-3JUCDu-yrFK7TMAvz9i58a4COrcLa_GAtGLfFkc04e7xz_tnm77v6BrtDGAIeshdWtNyVFJ4Ig76U_oaUTtNR9BvngXg-ikmTWZ0sYCLXOm45wcay3YPKAiGn3CDbpKRr0rpmVVYlux-XF6pigARcnZGKJPGg4mplev4-9mubYZFY9PY6HmuuT-tl9dbCUfg"
            alt="project"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end p-10">
            <div className="text-white">
              <span className="bg-green-500 px-3 py-1 rounded-full text-sm">Verified Project</span>
              <h1 className="text-3xl font-bold mt-2">Clean Water Initiative</h1>
              <p className="max-w-xl">Bridging water scarcity in Rift Valley</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
          <div className="lg:col-span-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">The Impact Story</h2>
              <p className="text-gray-600 mb-2">For decades, communities lacked clean water access...</p>
              <p className="text-gray-600">This initiative installs solar desalination systems...</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Fund Usage</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between"><span>Infrastructure</span><span>65%</span></div>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div className="bg-green-500 h-2 rounded" style={{ width: "65%" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded">Engineering 15%</div>
                  <div className="p-4 border rounded">Training 10%</div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <DonationWidget />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-6 mt-10 text-center text-gray-500">
        UnityBridge © 2024
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ProjectPage />
    </Provider>
  );
}
