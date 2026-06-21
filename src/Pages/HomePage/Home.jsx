import React from 'react'
import EcosystemImpact from './EcosystemImpact'
import CallToAction from './CallToAction'
import Hero from './Hero'
// Unity-Bridge-Platform Home Section
export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <EcosystemImpact></EcosystemImpact>
      <section class="bg-[#edf4ee] min-h-screen flex items-center justify-center font-sans p-6">

        <section class="max-w-6xl w-full text-center py-12 px-4">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">How UnityBridge Works</h2>
    <p class="text-gray-500 text-sm md:text-base tracking-wide mb-16">A streamlined process connecting resources to impact.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
      
      <div class="flex flex-col items-center text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <svg class="w-8 h-8 text-[#1e40af]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">1. Verified NGOs Post Needs</h3>
        <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
          Audited organizations outline specific projects, required funds, and volunteer roles.
        </p>
      </div>

      <div class="flex flex-col items-center text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <svg class="w-9 h-9 text-[#166534]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.757a2 2 0 110 4h-1.018a3 3 0 01-2.613 1.5H12a3 3 0 01-2.613-1.5H8.369a3 3 0 01-2.613-1.5H4.757a2 2 0 110-4H9.5M14 10V7a3 3 0 00-3-3h-.5M14 10h-4M9.5 10V7a3 3 0 013-3h.5" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">2. Donors & Volunteers Connect</h3>
        <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
          Individuals contribute capital or time directly to initiatives that match their values.
        </p>
      </div>

      <div class="flex flex-col items-center text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <svg class="w-8 h-8 text-[#1e40af]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6M21 21l-6-6m2 0a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">3. Radical Transparency Tracking</h3>
        <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
          Track every dollar and hour through verified impact reports and milestone updates.
        </p>
      </div>

    </div>
  </section>
      </section>
      <CallToAction></CallToAction>
    </div>
  )
}
