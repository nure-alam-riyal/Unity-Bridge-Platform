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
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6 select-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight m-0">My Impact Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Track your combined financial contributions and field volunteering hours parameters.</p>
        </div>
        <Tag color="emerald" className="px-3 py-1 font-bold rounded-lg tracking-wide shadow-sm text-xs uppercase">
          {activeMilestone.currentLevel}
        </Tag>
      </div>

      {/* DUAL PURPOSE METRIC CARDS */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Funds Contributed</span>}
              value={profileStats.totalDonated}
              precision={2}
              valueStyle={{ color: '#0D623B', fontWeight: 900, fontSize: '24px' }}
              prefix={<DollarOutlined className="mr-1 text-emerald-600" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Volunteered Time</span>}
              value={profileStats.hoursContributed}
              valueStyle={{ color: '#1E293B', fontWeight: 900, fontSize: '24px' }}
              prefix={<ClockCircleOutlined className="mr-1 text-blue-500" />}
              suffix={<span className="text-xs text-slate-400 font-normal"> Hours</span>}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Impact Campaigns Supported</span>}
              value={profileStats.campaignsSupported}
              valueStyle={{ color: '#1E293B', fontWeight: 900, fontSize: '24px' }}
              prefix={<HeartOutlined className="mr-1 text-rose-500" />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-none rounded-xl bg-white">
            <Statistic
              title={<span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ecosystem Merit Points</span>}
              value={profileStats.pointsEarned}
              valueStyle={{ color: '#B45309', fontWeight: 900, fontSize: '24px' }}
              prefix={<TrophyOutlined className="mr-1 text-amber-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* INTERACTIVE CHART AND MILESTONE TRACKER */}
      <Row gutter={[20, 20]}>
        {/* Dynamic Contribution Mix Curve */}
        <Col xs={24} lg={16}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">My Annual Contribution Flow Metrics</span>} className="shadow-sm border-none rounded-xl bg-white">
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
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Area type="monotone" dataKey="donations" name="Donations ($)" stroke="#0D623B" strokeWidth={2} fillOpacity={1} fill="url(#colorDonations)" />
                  <Area type="monotone" dataKey="hours" name="Field Hours" stroke="#365CCE" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Level Badging Tracker */}
        <Col xs={24} lg={8}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Next Milestone Track</span>} className="shadow-sm border-none rounded-xl bg-white h-full flex flex-col justify-between">
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <ThunderboltOutlined className="text-xl" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Next Target Badge</div>
                  <div className="text-sm font-bold text-slate-700">{activeMilestone.nextLevel}</div>
                </div>
              </div>
              
              <div className="pt-2">
                <Progress 
                  percent={activeMilestone.progressPercentage} 
                  strokeColor={{ '0%': '#365CCE', '100%': '#0D623B' }}
                  status="active"
                  showInfo={true}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed m-0 pt-1">
                Earn {100 - activeMilestone.pointsEarned % 100} more merit points by choosing operations shifts or backing community campaigns to unlock your upcoming rank tier privileges.
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* LOWER TABLES AND TIMELINES */}
      <Row gutter={[20, 20]}>
        {/* Scheduled Volunteer Shifts */}
        <Col xs={24} md={16}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">My Upcoming Volunteer Shifts</span>} className="shadow-sm border-none rounded-xl bg-white overflow-hidden h-full">
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
          </Card>
        </Col>

        {/* Recent Platform Notifications / Timeline Activity */}
        <Col xs={24} md={8}>
          <Card title={<span className="text-sm font-extrabold text-slate-700">Recent Badge Badges Logs</span>} className="shadow-sm border-none rounded-xl bg-white h-full">
            <Timeline className="mt-2 text-xs"
              items={[
                { color: 'green', children: 'Donated $300.00 targeting winter kits provision logistics.' },
                { color: 'blue', children: 'Completed 6 hours of mentoring block inside IT Literacy structures.' },
                { color: 'gray', children: 'Joined the Unity Bridge Network environment portfolio setup.' },
              ]}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}