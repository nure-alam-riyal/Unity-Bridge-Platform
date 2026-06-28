import React, { useState } from 'react';
import { Modal, Button, Progress, InputNumber, Tag, message } from 'antd';
import {
  SafetyCertificateOutlined,
  HeartOutlined,
  SolutionOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  PieChartOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

export default function ProjectDetails({ visible, onClose, projectData }) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Fallback to empty values if no project data is passed yet
  if (!projectData) return null;

  const handleDonate = () => {
    const finalAmount = selectedPreset || customAmount;
    if (!finalAmount) {
      return message.warning("Please select or type a donation amount.");
    }
    message.success(`Thank you for supporting this initiative with $${Number(finalAmount).toLocaleString()}!`);
  };

  // Filter out any accidentally empty strings from your requiredSkills array dataset
  const filteredSkills = projectData.requiredSkills?.filter(skill => skill.trim() !== '') || [];

  // Generate dynamic financial transparency allocations mathematically using your actual document budget
  const totalBudget = projectData.budget || 0;
  const allocations = [
    { label: "Infrastructure & Setup", percentage: 60, cost: totalBudget * 0.60, desc: "Direct logistical deployment assets." },
    { label: "Operations & Auditing", percentage: 20, cost: totalBudget * 0.20, desc: "Real-time transparent monitoring metrics." },
    { label: "Local Resource Training", percentage: 20, cost: totalBudget * 0.20, desc: "Skill development and baseline sustainability." }
  ];

  // Use real project images from projectData, or fallback to placeholder
  const projectImages = projectData.projectImages && projectData.projectImages.length > 0
    ? projectData.projectImages
    : [
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80"
      ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      bodyStyle={{ padding: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 80px)' }}
      className="overflow-hidden rounded-2xl"
    >
      {/* HERO BANNER COVER TIMELINE SEGMENT */}
      <div 
        className="relative bg-slate-900 px-6 py-16 md:p-12 flex flex-col justify-end min-h-[340px] text-white bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(15,23,42,0.95)), url(${projectImages[projectImages.length-1]})` }}
      >
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap gap-2">
            <Tag className="bg-[#1c4d37] border-none text-[#5cdb95] px-3 py-0.5 font-medium rounded-full flex items-center gap-1 text-xs uppercase tracking-wider">
              <SafetyCertificateOutlined /> {projectData.status || 'Verified Project'}
            </Tag>
            <Tag className="bg-slate-800 border-none text-slate-300 px-3 py-0.5 font-medium rounded-full text-xs">
              Timeline: {projectData.timeline || 'N/A'}
            </Tag>
            {projectData.location && (
              <Tag className="bg-slate-800 border-none text-slate-300 px-3 py-0.5 font-medium rounded-full text-xs flex items-center gap-1">
                <EnvironmentOutlined /> {projectData.location}
              </Tag>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {projectData.title}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light">
            Target Metrics: {projectData.impactMetric}
          </p>
        </div>
      </div>

      {/* CORE INFO GRID COLUMN LAYOUT */}
      <div className="p-6 md:p-8 bg-[#F9FBFA] grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Context Narrative */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GlobalOutlined className="text-[#0D623B]" /> The Impact Story
            </h3>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap space-y-4">
              {projectData.description}
            </div>
          </div>

          {/* Budget Financial Progress Matrix Mapping */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <PieChartOutlined className="text-[#0D623B]" /> Radical Transparency: Fund Usage
                </h3>
                <p className="text-xs text-slate-400">Target Budget: ${totalBudget.toLocaleString()} USD</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {allocations.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F7FAF8] border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
                      <span className="text-sm font-bold text-[#0D623B]">{item.percentage}%</span>
                    </div>
                    <Progress 
                      percent={item.percentage} 
                      showInfo={false} 
                      strokeColor="#0D623B" 
                      trailColor="#E2E8E4"
                      className="mb-2"
                    />
                    <p className="text-xs font-bold text-slate-700 mb-1">${item.cost.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 font-light leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase Gallery */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Project Assets</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {projectImages.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative group">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SIDEBAR RIGHT CONTAINER COLUMNS */}
        <div className="space-y-6">
          
          {/* FUEL THE IMPACT DONATION CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0D623B]" />
            <h3 className="text-base font-bold text-slate-900 mb-0.5">Fuel the Impact</h3>
            <p className="text-[11px] text-slate-400 mb-4">Administered safely by: <strong>{projectData.ngoName}</strong></p>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[50, 100, 250].map((amt) => (
                <Button 
                  key={amt}
                  className={`h-10 text-xs font-semibold rounded-xl border ${
                    selectedPreset === amt 
                      ? 'bg-[#0D623B] text-white border-none' 
                      : 'border-slate-200 text-slate-700 hover:text-[#0D623B] hover:border-[#0D623B]'
                  }`}
                  onClick={() => {
                    setSelectedPreset(amt);
                    setCustomAmount('');
                  }}
                >
                  ${amt}
                </Button>
              ))}
            </div>

            <div className="mb-4">
              <InputNumber
                prefix={<span className="text-slate-400 font-medium">$</span>}
                placeholder="Custom Donation Amount"
                value={customAmount}
                className="w-full h-10 bg-[#F7FAF8] border-[#E2E8E4] rounded-xl flex items-center text-xs"
                onChange={(val) => {
                  setCustomAmount(val);
                  setSelectedPreset(null);
                }}
              />
            </div>

            <Button
              type="primary"
              icon={<HeartOutlined />}
              onClick={handleDonate}
              className="w-full h-11 bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-semibold rounded-xl text-sm tracking-wide flex items-center justify-center gap-2 mb-3"
            >
              Donate to Project
            </Button>
            
            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <CheckCircleOutlined className="text-emerald-500" /> Secure SSL Encrypted Connection
            </div>
          </div>

          {/* VOLUNTEER ROLES CARD GENERATED FROM DATASET REQUIRED SKILLS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TeamOutlined className="text-[#0D623B]" /> Technical Positions
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Target Headcount Size: {projectData.volunteerCount || 0} Members</p>
            </div>
            
            <div className="space-y-2.5">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-[#EDF4F0] rounded-lg text-[#0D623B] text-sm flex items-center justify-center">
                      <SolutionOutlined />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate capitalize">{skill} Specialist</h4>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">Urgent Field Operation Role</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">No specific skills listed for this project stage.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
}