// src/pages/DonationCheckout.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAmount,
  setFrequency,
  updateField,
} from "../redux/slices/donationSlice";

const amounts = [25, 50, 100];

export default function DonationCheckout() {
  const dispatch = useDispatch();

  const {
    amount,
    frequency,
    firstName,
    lastName,
    email,
    cardNumber,
    expiry,
    cvc,
  } = useSelector((state) => state.donation);

  const [customAmount, setCustomAmount] = useState("");

  const handleAmount = (value) => {
    dispatch(setAmount(value));
  };

  return (
    <div className="min-h-screen bg-[#f4fbf4] text-[#161d19]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#006c49]">
            <span className="material-symbols-outlined">
              volunteer_activism
            </span>
            UnityBridge
          </div>

          <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#006c49]">
            <span className="material-symbols-outlined">close</span>
            Cancel
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pb-16 pt-28 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold">Secure Checkout</h1>

            <p className="mt-2 text-gray-600">
              Your contribution to the Clean Water Initiative directly funds
              community wells.
            </p>

            <div className="mt-8 space-y-10">
              {/* Amount */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  Select Amount
                </h2>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {amounts.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleAmount(item)}
                      className={`rounded-lg border py-3 font-semibold transition ${
                        amount === item
                          ? "border-[#006c49] bg-[#006c49]/5 text-[#006c49]"
                          : "border-gray-300 hover:border-[#006c49]"
                      }`}
                    >
                      ${item}
                    </button>
                  ))}

                  <input
                    type="number"
                    placeholder="Custom"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      dispatch(setAmount(Number(e.target.value)));
                    }}
                    className="rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-[#006c49]"
                  />
                </div>

                {/* Frequency */}
                <div className="mt-5 flex gap-6 rounded-lg bg-[#eef6ee] p-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      checked={frequency === "one-time"}
                      onChange={() => dispatch(setFrequency("one-time"))}
                    />
                    One-time
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      checked={frequency === "monthly"}
                      onChange={() => dispatch(setFrequency("monthly"))}
                    />
                    Monthly
                  </label>
                </div>
              </section>

              {/* User Info */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  Your Information
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) =>
                      dispatch(
                        updateField({
                          field: "firstName",
                          value: e.target.value,
                        })
                      )
                    }
                    placeholder="Jane"
                  />

                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) =>
                      dispatch(
                        updateField({
                          field: "lastName",
                          value: e.target.value,
                        })
                      )
                    }
                    placeholder="Doe"
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Email Address"
                      value={email}
                      onChange={(e) =>
                        dispatch(
                          updateField({
                            field: "email",
                            value: e.target.value,
                          })
                        )
                      }
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  Payment Details
                </h2>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between border-b border-gray-200 bg-[#e8f0e9] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="material-symbols-outlined text-[#4059aa]">
                        lock
                      </span>
                      Secure Encrypted Connection
                    </div>

                    <div className="flex gap-2 text-gray-500">
                      <span className="material-symbols-outlined">
                        credit_card
                      </span>
                      <span className="material-symbols-outlined">
                        account_balance
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <Input
                      label="Card Number"
                      value={cardNumber}
                      onChange={(e) =>
                        dispatch(
                          updateField({
                            field: "cardNumber",
                            value: e.target.value,
                          })
                        )
                      }
                      placeholder="0000 0000 0000 0000"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry"
                        value={expiry}
                        onChange={(e) =>
                          dispatch(
                            updateField({
                              field: "expiry",
                              value: e.target.value,
                            })
                          )
                        }
                        placeholder="MM/YY"
                      />

                      <Input
                        label="CVC"
                        value={cvc}
                        onChange={(e) =>
                          dispatch(
                            updateField({
                              field: "cvc",
                              value: e.target.value,
                            })
                          )
                        }
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#006c49] py-4 font-semibold text-white transition hover:bg-[#005236]">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
                Complete ${amount || 50} {frequency} Donation
              </button>

              <p className="text-center text-sm text-gray-500">
                By donating, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 lg:col-span-5">
          {/* Project */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop"
              alt="Clean Water"
              className="h-52 w-full object-cover"
            />

            <div className="p-6">
              <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-[#4059aa]/10 px-3 py-1 text-sm font-semibold text-[#4059aa]">
                <span className="material-symbols-outlined text-sm">
                  verified
                </span>
                Verified Project
              </div>

              <h3 className="text-2xl font-bold">
                Clean Water Initiative
              </h3>

              <p className="mt-2 text-gray-600">
                Providing sustainable deep-bore wells to communities in need.
              </p>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-500">Funding Goal</span>
                  <span className="font-semibold text-[#006c49]">
                    $45,000 / $50,000
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[90%] bg-[#006c49]" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-gray-200 pt-4">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="ngo"
                  className="h-10 w-10 rounded-full"
                />

                <div>
                  <p className="font-semibold">GlobalWater NGO</p>

                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-sm text-[#4059aa]">
                      fact_check
                    </span>
                    Audited 2023
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transparency */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4059aa]">
                pie_chart
              </span>

              <h3 className="text-2xl font-bold">
                Radical Transparency
              </h3>
            </div>

            <p className="mb-6 text-gray-600">
              How your ${amount || 50} {frequency} gift is allocated.
            </p>

            <TransparencyItem
              value="85%"
              label="Direct Impact (Wells, Filtration)"
              width="85%"
              color="bg-[#006c49]"
            />

            <TransparencyItem
              value="10%"
              label="Logistics & Transport"
              width="10%"
              color="bg-[#4059aa]"
            />

            <TransparencyItem
              value="5%"
              label="Platform Operations"
              width="5%"
              color="bg-gray-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold">{label}</label>

      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10"
      />
    </div>
  );
}

function TransparencyItem({ value, label, width, color }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <div className="w-12 text-right font-bold">{value}</div>

      <div className="flex-1">
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div className={`h-full ${color}`} style={{ width }} />
        </div>

        <p className="mt-1 text-sm text-gray-700">{label}</p>
      </div>
    </div>
  );
}