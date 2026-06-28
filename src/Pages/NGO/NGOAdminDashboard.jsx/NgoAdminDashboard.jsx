import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Empty, Spin } from 'antd';
import { 
  ArrowUpOutlined, 
  HeartOutlined, 
  UserOutlined, 
  ProjectOutlined, 
  DollarCircleOutlined 
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import useQuerys from '../../../Hooks/useQuerys';
import Loading from '../../../components/Loading';

const formatCompactNumber = (number) => {


  if (number == null || isNaN(number)) return '0';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(number);
};

export default function NgoAdminDashboard() {
  
  const axios = usePublicAxios();
const oneuser = useQuerys({ users: "users" });
  const ngoEmail = oneuser?.[0]?.email;
 const [recenProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  if (!ngoEmail) return;

  setLoading(true);

  axios.get("projects")
    .then((res) => {
      const data = res.data.recentProjects || res.data || [];

      // Projects of this NGO
      const ngoProjects = data.filter(
        (project) => project.ngoEmail === ngoEmail
      );

      // Total Budget
      const total = ngoProjects.reduce(
        (sum, project) => sum + (project.budget || 0),
        0
      );

      // Total Fund Raised
      const fundRaised = ngoProjects.reduce((sum, project) => {
        const donation = (project.donorDetails || []).reduce(
          (donorSum, donor) => donorSum + (donor.amount || 0),
          0
        );
        return sum + donation;
      }, 0);

      setRecentProjects({
        total,
        fundRaised,
        dept: total - fundRaised,
      });

      setLoading(false);
    })
    
.catch((err) => {
        setLoading(false);
      });
  }, [ngoEmail, axios]);
  console.log(recenProjects)
if(loading)
  <Loading></Loading>
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['ngoDashboardStats'],
    queryFn: async () => {
      const response = await axios.get('ngo/dashboard-summary');
      return response.data;
    }
  });
console.log(dashboardData)
  const stats = dashboardData?.stats

  const chartData = dashboardData?.chartData
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
      render: (val) => <span className="font-mono text-xs">${formatCompactNumber(val)}</span>
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

  const recentProjects = dashboardData?.recentProjects
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" tip="Loading Awesome Dashboard Workspace..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen space-y-8 select-none">
      
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-emerald-800/30">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">NGO Workspace</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">NGO Operations Dashboard</h1>
            <p className="text-xs text-slate-300/80 mt-1.5 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              NURE ALAM RIYAL • Platform Operations & Management Control Center
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 font-bold rounded-full tracking-wide text-[10px] uppercase">
              Live Database Connected
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Sync Interval: Real-time</span>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-400">Total Funds Raised</p>
                <h3 className="text-2xl font-black text-green-800 mt-2 flex items-center">
                  <FaBangladeshiTakaSign className="text-emerald-600 mr-1 text-xl" />
                  {recenProjects?.fundRaised}
                </h3>
                <p className="text-xs font-bold mt-2 uppercase tracking-wider text-slate-400">Total Budget</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center">
                  <FaBangladeshiTakaSign className="text-emerald-600 mr-1 text-xl" />
                  {recenProjects?.total}
                </h3>
                <p className="text-xs mt-2 text-red-600 font-bold uppercase tracking-wider ">Total Need</p>
                <h3 className="text-2xl text-red-600 font-black  w-full flex items-center">
                  <FaBangladeshiTakaSign className="text-emerald-600 mr-1 text-xl" />
                  {recenProjects?.dept}
                </h3>

              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <DollarCircleOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <ArrowUpOutlined />
              <span>+12% growth this month</span>
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Volunteers</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {stats.activeVolunteers}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <UserOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Currently active field agents</span>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Deployed Projects</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {stats.runningProjects}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <ProjectOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Managed under your organization</span>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Impact Reached</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {stats.impactReached.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                <HeartOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Individual beneficiaries assisted</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* CHARTS CONTAINER */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 h-full">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Financial Streams</span>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Funding & Operational Impact Curve</h4>
            </div>
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
                  <YAxis tickLine={false} tickFormatter={formatCompactNumber} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip 
                    formatter={(value) => [`৳${value.toLocaleString()}`, 'Donations']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} 
                  />
                  <Area type="monotone" dataKey="donations" stroke="#0D623B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDonations)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 h-full">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Metrics Reach</span>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Beneficiary Reach Tracking</h4>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} tickFormatter={formatCompactNumber} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), 'People Assisted']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} 
                  />
                  <Bar dataKey="reached" fill="#365CCE" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
      </Row>

      {/* RECENT PROJECTS LIST */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h4 className="text-base font-extrabold text-slate-800 m-0">Active Operational Projects Portfolio</h4>
          <p className="text-xs text-slate-400 mt-1">Live status of current development projects under your governance.</p>
        </div>
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
      </div>

    </div>
  );
}