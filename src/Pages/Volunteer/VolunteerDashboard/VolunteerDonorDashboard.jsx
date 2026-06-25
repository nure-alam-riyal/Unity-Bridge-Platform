import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Empty, Progress, Timeline } from 'antd';
import { 
  HeartOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined, 
  ThunderboltOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';


export default function VolunteerDonorDashboard() {
  const axios = usePublicAxios();

  // Fetch live metrics safely from your database backend 
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['volunteerDonorStats'],
    queryFn: async () => {
      const response = await axios.get('user/volunteer-donor-summary');
      return response.data;
    }
  });
console.log(dashboardData)
  // Fallback fallback datasets matching your MongoDB document schemas
  const profileStats = dashboardData?.stats || {
    totalDonated: 1450,
    hoursContributed: 48,
    pointsEarned: 320,
    campaignsSupported: 6
  };

  const contributionHistory = dashboardData?.contributionHistory || [
    { month: 'Jan', donations: 150, hours: 4 },
    { month: 'Feb', donations: 300, hours: 8 },
    { month: 'Mar', donations: 0, hours: 12 },
    { month: 'Apr', donations: 500, hours: 6 },
    { month: 'May', donations: 200, hours: 10 },
    { month: 'Jun', donations: 300, hours: 8 },
  ];

  const upcomingShifts = dashboardData?.upcomingShifts || [
    { key: '1', project: 'Clean Water Sabar Initiative', role: 'Distribution Lead', date: 'June 24, 2026', time: '09:00 AM' },
    { key: '2', project: 'IT Literacy Bootcamp', role: 'Technical Mentor', date: 'July 02, 2026', time: '02:00 PM' },
  ];

  const activeMilestone = dashboardData?.milestone || {
    currentLevel: 'Silver Changemaker',
    nextLevel: 'Gold Guardian',
    progressPercentage: 72
  };

  if (isLoading) return <Loading />;

  const shiftColumns = [
    {
      title: 'ASSIGNED PROJECT',
      dataIndex: 'project',
      key: 'project',
      className: 'font-semibold text-slate-700 text-xs'
    },
    {
      title: 'OPERATIONAL ROLE',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue" className="text-[10px] font-bold rounded">{role.toUpperCase()}</Tag>
    },
    {
      title: 'SCHEDULED DATE',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => (
        <span className="text-xs text-slate-500 font-medium">
          <CalendarOutlined className="mr-1" /> {record.date} ({record.time})
        </span>
      )
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen space-y-6 select-none">
      
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-indigo-800/30">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Volunteer & Donor HUB</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">My Impact Workspace</h1>
            <p className="text-xs text-slate-300/80 mt-1.5 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              Track your combined financial contributions and field volunteering hours parameters.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 font-extrabold rounded-full tracking-wider text-[10px] uppercase">
              {activeMilestone.currentLevel}
            </span>
          </div>
        </div>
      </div>

      {/* DUAL PURPOSE METRIC CARDS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Funds Contributed</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  ৳{profileStats.totalDonated.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <DollarOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Financial support deployed</span>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteered Time</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {profileStats.hoursContributed}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <ClockCircleOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Total hours served on field</span>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-600"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Campaigns Supported</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {profileStats.campaignsSupported}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                <HeartOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Active campaigns joined</span>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Ecosystem Merit Points</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {profileStats.pointsEarned}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <TrophyOutlined className="text-xl" />
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 font-medium">
              <span>Earned through platform contributions</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* INTERACTIVE CHART AND MILESTONE TRACKER */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Historical Flow</span>
              <h4 className="text-base font-extrabold text-slate-800 m-0">My Annual Contribution Flow Metrics</h4>
            </div>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={contributionHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D623B" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0D623B" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#365CCE" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#365CCE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <YAxis tickLine={false} style={{ fontSize: '11px', fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Area type="monotone" dataKey="donations" name="Donations (৳)" stroke="#0D623B" strokeWidth={2} fillOpacity={1} fill="url(#colorDonations)" />
                  <Area type="monotone" dataKey="hours" name="Field Hours" stroke="#365CCE" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 h-full flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Milestone progress</span>
                <h4 className="text-base font-extrabold text-slate-800 m-0">Next Milestone Track</h4>
              </div>
              
              <div className="space-y-5 mt-4">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <ThunderboltOutlined className="text-xl animate-bounce" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next Target Badge</div>
                    <div className="text-sm font-black text-slate-700">{activeMilestone.nextLevel}</div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                    <span>Rank Progress</span>
                    <span>{activeMilestone.progressPercentage}%</span>
                  </div>
                  <Progress 
                    percent={activeMilestone.progressPercentage} 
                    strokeColor={{ '0%': '#365CCE', '100%': '#0D623B' }}
                    status="active"
                    showInfo={false}
                  />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-50 mt-4">
              <p className="text-[11px] text-slate-400 leading-relaxed m-0">
                Earn {100 - activeMilestone.pointsEarned % 100} more merit points by choosing operations shifts or backing community campaigns to unlock your upcoming rank tier privileges.
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* LOWER TABLES AND TIMELINES */}
      <Row gutter={[20, 20]}>
        <Col xs={24} md={16}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden h-full">
            <div className="p-6 border-b border-slate-100">
              <h4 className="text-base font-extrabold text-slate-800 m-0">My Upcoming Volunteer Shifts</h4>
              <p className="text-xs text-slate-400 mt-1">Assignments scheduled on active development projects.</p>
            </div>
            {upcomingShifts.length > 0 ? (
              <Table 
                columns={shiftColumns} 
                dataSource={upcomingShifts} 
                pagination={false} 
                size="middle"
                className="border-none"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active field shifts scheduled." />
            )}
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xs p-6 h-full">
            <div className="mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity Feed</span>
              <h4 className="text-base font-extrabold text-slate-800 m-0">Recent Logs</h4>
            </div>
            <Timeline className="mt-6 text-xs"
              items={[
                { color: 'green', children: <span className="text-slate-600 font-medium">Donated ৳300.00 targeting winter kits provision logistics.</span> },
                { color: 'blue', children: <span className="text-slate-600 font-medium">Completed 6 hours of mentoring block inside IT Literacy structures.</span> },
                { color: 'gray', children: <span className="text-slate-600 font-medium">Joined the Unity Bridge Network environment portfolio setup.</span> },
              ]}
            />
          </div>
        </Col>
      </Row>

    </div>
  );
}