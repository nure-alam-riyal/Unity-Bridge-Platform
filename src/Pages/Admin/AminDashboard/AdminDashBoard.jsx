import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Empty, Progress, Avatar } from 'antd';
import { 
  UserOutlined, 
  SafetyCertificateOutlined, 
  HeartOutlined, 
  ProjectOutlined, 
  DollarCircleOutlined, 
  TeamOutlined, 
  ArrowUpOutlined 
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

import { useQuery } from '@tanstack/react-query';

import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';

export default function AdminDashboard() {
  const axios = usePublicAxios();

 
  const { data: adminData, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const response = await axios.get('admin/dashboard-summary');
      return response.data;
    }
  });

  console.log(adminData)
 
  const counters = adminData?.counters || {
    totalUsers: 1250,
    ngoCount: 42,
    volunteerDonorCount: 840,
    activeProjects: 28,
    totalDonationsAmount: 185400,
    pendingVerifications: 5
  };

  const operationalTrends = adminData?.trends || [
    { month: 'Jan', donations: 12000, registrations: 45 },
    { month: 'Feb', donations: 19000, registrations: 80 },
    { month: 'Mar', donations: 32000, registrations: 120 },
    { month: 'Apr', donations: 27000, registrations: 95 },
    { month: 'May', donations: 45000, registrations: 160 },
    { month: 'Jun', donations: 50400, registrations: 190 },
  ];

  const recentUsers = adminData?.recentUsers || [
    { key: '1', name: 'Al-Amin Rahman', email: 'alamin@gmail.com', role: 'NGO', status: 'Pending Verification' },
    { key: '2', name: 'Nure Alam Riyal', email: 'riyal@ju.edu', role: 'volunteer&donor', status: 'Active' },
    { key: '3', name: 'Sadia Islam', email: 'sadia@outlook.com', role: 'volunteer&donor', status: 'Active' },
  ];

  if (isLoading) return <Loading />;

  const userColumns = [
    {
      title: 'USER INITIALS',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-slate-100 text-slate-700 font-bold" size="small">
            {text.charAt(0)}
          </Avatar>
          <div>
            <div className="font-bold text-slate-800 text-xs">{text}</div>
            <div className="text-[10px] text-slate-400 font-mono">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'ROLE ECOSYSTEM TIER',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = role === 'NGO' ? 'purple' : role === 'admin' ? 'volcano' : 'blue';
        return <Tag color={color} className="text-[10px] font-extrabold rounded tracking-wider uppercase">{role}</Tag>;
      }
    },
    {
      title: 'SYSTEM STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Active' ? 'emerald' : 'amber';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold
            ${status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <span className={`w-1 h-1 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {status.toUpperCase()}
          </span>
        );
      }
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen space-y-6 select-none">
      
      {/* GLOBAL SYSTEM CONTROL HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-52 h-52 bg-slate-700/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-slate-600/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">System Root Console</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">System Root Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1.5">Global platform health analytics, collections parameters, and data logs routing frameworks.</p>
          </div>
          <div className="flex items-center gap-2">
            {counters.pendingVerifications > 0 && (
              <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 font-bold rounded-full tracking-wide text-[10px] uppercase animate-pulse">
                {counters.pendingVerifications} VERIFICATIONS PENDING
              </span>
            )}
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 font-bold rounded-full tracking-wide text-[10px] uppercase">
              ROOT SUPERUSER ACCESS
            </span>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Funds Collected</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  ৳{counters.totalDonationsAmount.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <DollarCircleOutlined className="text-xl" />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Members</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {counters.totalUsers}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <TeamOutlined className="text-xl" />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered NGOs</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {counters.ngoCount}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <SafetyCertificateOutlined className="text-xl" />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Project Shells</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {counters.activeProjects}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <ProjectOutlined className="text-xl" />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* TREND CHARTS */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={14}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Collections Analytics</span>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Platform Cross-Collection Funding Growth</h4>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={operationalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D623B" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0D623B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="donations" name="Donations Flow (৳)" stroke="#0D623B" strokeWidth={2.5} fillOpacity={1} fill="url(#adminDonations)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">User Acquisition</span>
              <h4 className="text-base font-extrabold text-slate-800 m-0">User Growth Registrations</h4>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operationalTrends} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Bar dataKey="registrations" name="New Registries" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* ROLE DISTRIBUTION SPLITS & LOG TABLES */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100">
              <h4 className="text-base font-extrabold text-slate-800 m-0">Recent Accounts Pipeline Auditing</h4>
              <p className="text-xs text-slate-400 mt-1">Review accounts awaiting database activation or profile checks.</p>
            </div>
            {recentUsers.length > 0 ? (
              <Table 
                columns={userColumns} 
                dataSource={recentUsers} 
                pagination={false} 
                size="middle"
                className="border-none"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No newly created document registries." />
            )}
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 h-full flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demographics</span>
                <h4 className="text-base font-extrabold text-slate-800 m-0">Platform Persona Metrics</h4>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>VOLUNTEER & DONORS</span>
                    <span className="font-mono">{(counters.volunteerDonorCount / counters.totalUsers * 100).toFixed(0)}%</span>
                  </div>
                  <Progress percent={(counters.volunteerDonorCount / counters.totalUsers * 100)} showInfo={false} strokeColor="#3b82f6" trailColor="#f1f5f9" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>NGO CORPORATE WORKSPACES</span>
                    <span className="font-mono">{(counters.ngoCount / counters.totalUsers * 100).toFixed(0)}%</span>
                  </div>
                  <Progress percent={(counters.ngoCount / counters.totalUsers * 100)} showInfo={false} strokeColor="#a855f7" trailColor="#f1f5f9" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6">
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100/50 flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Live System Integrity</div>
                  <div className="text-xs font-black text-emerald-800">All Nodes Functional</div>
                </div>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

    </div>
  );
}