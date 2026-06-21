import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Empty, Spin } from 'antd';
import { 
  ArrowUpOutlined, 
  HeartOutlined, 
  UserOutlined, 
  ProjectOutlined, 
  DollarCircleOutlined 
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';

export default function NgoAdminDashboard() {
  const axios = usePublicAxios();

  // 1. Fetch live metrics & charts data securely from your database backend 
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['ngoDashboardStats'],
    queryFn: async () => {
      const response = await axios.get('ngo/dashboard-summary');
      return response.data;
    }
  });

  // Fallback structural mock schemas for instant visualization if your backend endpoint is raw or empty
  const stats = dashboardData?.stats || {
    totalDonations: 48250,
    activeVolunteers: 142,
    runningProjects: 12,
    impactReached: 3400
  };

  const chartData = dashboardData?.chartData || [
    { month: 'Jan', donations: 4000, reached: 2400 },
    { month: 'Feb', donations: 3000, reached: 1398 },
    { month: 'Mar', donations: 9800, reached: 2000 },
    { month: 'Apr', donations: 2780, reached: 2780 },
    { month: 'May', donations: 1890, reached: 4800 },
    { month: 'Jun', donations: 2390, reached: 3800 },
  ];

  const projectColumns = [
    {
      title: 'PROJECT NAME',
      dataIndex: 'name',
      key: 'name',
      className: 'font-semibold text-slate-700 text-xs'
    },
    {
      title: 'BUDGET',
      dataIndex: 'budget',
      key: 'budget',
      render: (val) => <span className="font-mono text-xs">${val.toLocaleString()}</span>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'Active' ? 'green' : 'orange';
        return <Tag color={color} className="rounded font-bold text-[10px]">{status.toUpperCase()}</Tag>;
      }
    }
  ];

  const recentProjects = dashboardData?.recentProjects || [
    { key: '1', name: 'Clean Water Sabar Initiative', budget: 12000, status: 'Active' },
    { key: '2', name: 'Winter Clothing Drive 2026', budget: 4500, status: 'Completed' },
    { key: '3', name: 'IT Literacy Bootcamps', budget: 8500, status: 'Active' },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" tip="Loading Awesome Dashboard Workspace..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-8 select-none">
      
      {/* HEADER ROW BAR WITH BRAND IDENTITY */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight m-0">NGO Workspace Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">NURE ALAM RIYAL • Platform Operations & Management Control Center</p>
        </div>
        <Tag color="geekblue" className="px-3 py-1 font-bold rounded-lg tracking-wide shadow-sm text-xs">
          LIVE DATABASE MATRIX ACTIVE
        </Tag>
      </div>

      {/* 4 CORE METRIC OVERVIEW CARDS */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md border-none rounded-xl bg-white transition-all duration-300">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Funds Raised</span>}
              value={stats.totalDonations}
              precision={2}
              valueStyle={{ color: '#0D623B', fontWeight: 900, fontSize: '24px' }}
              prefix={<DollarCircleOutlined className="mr-1 text-emerald-600" />}
              suffix={<span className="text-xs text-emerald-500 font-medium"><ArrowUpOutlined /> +12%</span>}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md border-none rounded-xl bg-white transition-all duration-300">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Volunteers</span>}
              value={stats.activeVolunteers}
              valueStyle={{ color: '#1E293B', fontWeight: 900, fontSize: '24px' }}
              prefix={<UserOutlined className="mr-1 text-blue-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md border-none rounded-xl bg-white transition-all duration-300">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deployed Projects</span>}
              value={stats.runningProjects}
              valueStyle={{ color: '#1E293B', fontWeight: 900, fontSize: '24px' }}
              prefix={<ProjectOutlined className="mr-1 text-indigo-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md border-none rounded-xl bg-white transition-all duration-300">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Impact Reached</span>}
              value={stats.impactReached}
              valueStyle={{ color: '#0D623B', fontWeight: 900, fontSize: '24px' }}
              prefix={<HeartOutlined className="mr-1 text-rose-500" />}
              suffix={<span className="text-xs text-slate-400 font-normal"> souls</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* GRAPH CHART INFRASTRUCTURE ROWS */}
      <Row gutter={[20, 20]}>
        {/* Donation Trends Flow Chart Area */}
        <Col xs={24} lg={16}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Financial Funding & Operational Impact Curve</span>} className="shadow-sm border-none rounded-xl bg-white h-full">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D623B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0D623B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Area type="monotone" dataKey="donations" name="Donations ($)" stroke="#0D623B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDonations)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Categorical Distribution Bar Chart Column */}
        <Col xs={24} lg={8}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Beneficiary Reach Tracking</span>} className="shadow-sm border-none rounded-xl bg-white h-full">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="reached" name="People Assisted" fill="#365CCE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* LOWER DATA MATRIX SEGMENTATION TABLE */}
      <Card title={<span className="text-sm font-extrabold text-slate-700">Active Operational Projects Portfolio</span>} className="shadow-sm border-none rounded-xl bg-white overflow-hidden">
        {recentProjects.length > 0 ? (
          <Table 
            columns={projectColumns} 
            dataSource={recentProjects} 
            pagination={false} 
            className="border-none"
            size="middle"
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active ecosystem projects found." />
        )}
      </Card>

    </div>
  );
}