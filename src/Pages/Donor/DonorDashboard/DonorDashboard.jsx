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
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
        <div>
          <Title level={3} className="m-0 font-black">Donor Terminal</Title>
          <Text type="secondary">{user?.email}</Text>
        </div>
        <div className="flex items-center gap-3">
          <Tag color="emerald" className="font-bold py-1 px-3"><SafetyCertificateOutlined /> Gateway Synced</Tag>
          <Link to="/donor/mydonation">
            <Button type="primary" icon={<FileTextOutlined />} className="bg-blue-600 hover:bg-blue-700">My Donations</Button>
          </Link>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card className="rounded-xl shadow-sm">
            <Statistic title="Total Capital Contributed" value={totalAmount} suffix=" BDT" prefix={<DollarCircleOutlined className="text-emerald-500" />} />
          </Card>
        </Col>
      </Row>

      <Card title={<div className="text-xs uppercase font-bold tracking-wider"><HistoryOutlined /> Safe Settlement Ledger</div>} className="rounded-xl shadow-sm">
        <Table columns={columns} dataSource={history} loading={loading} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
}