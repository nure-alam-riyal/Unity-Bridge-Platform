import React from 'react';
import { WalletOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';

export default function LiveImpactStats() {
  const stats = [
    {
      id: 1,
      icon: <WalletOutlined className="text-2xl text-slate-700" />,
      value: '$12.4M',
      label: 'FUNDS RAISED',
    },
    {
      id: 2,
      icon: <TeamOutlined className="text-2xl text-slate-700" />,
      value: '48,291',
      label: 'ACTIVE VOLUNTEERS',
    },
    {
      id: 3,
      icon: <EnvironmentOutlined className="text-2xl text-slate-700" />, // Standard AntD alternative for tree/nature impact
      value: '1.2M+',
      label: 'LIVES IMPACTED',
    },
  ];

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-wide">
            Live Ecosystem Impact
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1">
            Real-time statistics driven by radical transparency.
          </p>
        </div>

        {/* Stats Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {stats.map((stat, idx) => (
            <div
              key={stat.id}
              className={`flex flex-col items-center justify-center p-8 bg-white text-center
                ${idx !== stats.length - 1 ? 'border-b md:border-b-0 md:border-r border-slate-200' : ''}
              `}
            >
              {/* Icon Container */}
              <div className="mb-3 flex items-center justify-center h-10 w-10 rounded-full bg-slate-50">
                {stat.icon}
              </div>
              
              {/* Statistic Value */}
              <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              
              {/* Label */}
              <span className="text-xs md:text-sm font-semibold text-slate-500 tracking-wider mt-1 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}