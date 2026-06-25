import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { notification, Typography, Card, Row, Col, Statistic, Table, Tag, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, DollarCircleOutlined, SafetyCertificateOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import useAuth from '../../../Hooks/useAuth';
import usePublicAxios from '../../../Hooks/usePublicAxios';

const { Title, Text } = Typography;

export default function DonorDashboard() {
  const { user } = useAuth();
  const axios = usePublicAxios();
  const [searchParams] = useSearchParams();
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  const paymentStatus = searchParams.get('status');
  const transactionId = searchParams.get('tran');

  useEffect(() => {
    if (paymentStatus === 'success') {
      notification.success({ message: 'Donation Completed!', description: `Transaction Verified ID: ${transactionId}`, placement: 'topRight' });
    } else if (paymentStatus === 'failed') {
      notification.error({ message: 'Transaction Failed', description: 'Payment mapping aborted.', placement: 'topRight' });
    } else if (paymentStatus === 'cancelled') {
      notification.warning({ message: 'Session Cancelled', description: 'User closed payment interface.', placement: 'topRight' });
    }
  }, [paymentStatus, transactionId]);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axios.get('/projects')
        .then(res => {
          const userDonations = [];
          let aggregateSum = 0;

          (res.data || []).forEach(project => {
            if (project.donorDetails) {
              project.donorDetails.forEach(donor => {
                if (donor.email === user.email) {
                  aggregateSum += Number(donor.amount);
                  userDonations.push({
                    key: donor.transactionId,
                    projectTitle: project.title,
                    amount: donor.amount,
                    date: new Date(donor.donatedAt).toLocaleDateString('en-GB'),
                    status: donor.status
                  });
                }
              });
            }
          });

          setHistory(userDonations);
          setTotalAmount(aggregateSum);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, paymentStatus]);

  const columns = [
    { title: 'Project Context', dataIndex: 'projectTitle', key: 'projectTitle' },
    { title: 'Transaction Node', dataIndex: 'key', key: 'key', render: (id) => <span className="font-mono text-xs">{id}</span> },
    { title: 'Settlement Date', dataIndex: 'date', key: 'date' },
    { title: 'Contribution', dataIndex: 'amount', key: 'amount', render: (val) => <span className="font-bold text-emerald-600">৳{val}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st) => <Tag color="green">{st}</Tag> }
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen space-y-6 select-none">
      
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-emerald-800/30">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Donor Workspace</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">Donor Terminal</h1>
            <p className="text-xs text-slate-300/80 mt-1.5 font-medium flex items-center gap-1.5 font-mono">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 font-bold rounded-full tracking-wide text-[10px] uppercase">
              Gateway Synced
            </span>
            <Link to="/donor/mydonation">
              <Button type="primary" icon={<FileTextOutlined />} className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg h-8 text-xs font-semibold">My Donations</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* STATISTIC CARD */}
      <Row gutter={16}>
        <Col span={24}>
          <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Capital Contributed</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">
                  ৳{totalAmount.toLocaleString()} BDT
                </h3>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <DollarCircleOutlined className="text-2xl" />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* TRANSACTION TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <HistoryOutlined className="text-slate-400" />
          <h4 className="text-base font-extrabold text-slate-800 m-0">Safe Settlement Ledger</h4>
        </div>
        <Table columns={columns} dataSource={history} loading={loading} pagination={{ pageSize: 5 }} className="border-none" />
      </div>
    </div>
  );
}