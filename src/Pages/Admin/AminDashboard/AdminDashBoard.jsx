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
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6 select-none">
      
      {/* GLOBAL SYSTEM CONTROL HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight m-0">System Root Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Global platform health analytics, collections parameters, and data logs routing frameworks.</p>
        </div>
        <div className="flex items-center gap-2">
          {counters.pendingVerifications > 0 && (
            <Tag color="error" className="px-3 py-1 font-extrabold rounded-lg text-xs animate-pulse">
              {counters.pendingVerifications} VERIFICATIONS PENDING
            </Tag>
          )}
          <Tag color="slate" className="bg-slate-900 border-none text-white px-3 py-1 font-bold rounded-lg text-xs">
            ROOT SUPERUSER ACCESS
          </Tag>
        </div>
      </div>

      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Funds Collected</span>}
              value={counters.totalDonationsAmount}
              precision={2}
              valueStyle={{ color: '#0D623B', fontWeight: 900, fontSize: '24px' }}
              prefix={<DollarCircleOutlined className="mr-1 text-emerald-600" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total System Members</span>}
              value={counters.totalUsers}
              valueStyle={{ color: '#1E293B', fontWeight: 900, fontSize: '24px' }}
              prefix={<TeamOutlined className="mr-1 text-blue-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered NGOs</span>}
              value={counters.ngoCount}
              valueStyle={{ color: '#6B21A8', fontWeight: 900, fontSize: '24px' }}
              prefix={<SafetyCertificateOutlined className="mr-1 text-purple-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Project Shells</span>}
              value={counters.activeProjects}
              valueStyle={{ color: '#312E81', fontWeight: 900, fontSize: '24px' }}
              prefix={<ProjectOutlined className="mr-1 text-indigo-500" />}
            />
          </Card>
        </Col>
      </Row>

     
      <Row gutter={[20, 20]}>
       
        <Col xs={24} lg={14}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Platform Cross-Collection Funding Growth</span>} className="shadow-sm border-none rounded-xl bg-white">
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
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Area type="monotone" dataKey="donations" name="Donations Flow ($)" stroke="#0D623B" strokeWidth={2.5} fillOpacity={1} fill="url(#adminDonations)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* User Acquisition Bar Analytics */}
        <Col xs={24} lg={10}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">User Growth Registrations</span>} className="shadow-sm border-none rounded-xl bg-white">
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operationalTrends} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="registrations" name="New Registries" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ROLE DISTRIBUTION SPLITS & LOG TABLES */}
      <Row gutter={[20, 20]}>
        {/* User Accounts Overview Segment */}
        <Col xs={24} lg={16}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Recent Accounts Pipeline Auditing</span>} className="shadow-sm border-none rounded-xl bg-white overflow-hidden h-full">
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
          </Card>
        </Col>

        {/* User Base Segmentation distribution parameters */}
        <Col xs={24} lg={8}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Platform Persona Metrics</span>} className="shadow-sm border-none rounded-xl bg-white h-full">
            <div className="space-y-4 py-2">
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

              <div className="pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live System Integrity</div>
                    <div className="text-xs font-bold text-slate-700">All Nodes Functional</div>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
}