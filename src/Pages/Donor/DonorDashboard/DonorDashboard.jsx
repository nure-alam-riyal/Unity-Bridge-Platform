import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notification, Table, Tag, Card, Statistic, Row, Col } from 'antd';
import { CheckCircleOutlined, WalletOutlined } from '@ant-design/icons';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import useQuerys from '../../../Hooks/useQuerys';

export default function DonorDashboard() {
  const currentUser=useQuerys({users:"users"})
  const axios = usePublicAxios();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. TanStack Query for Syncing Donation History Data
  const { data: myDonations = [], isLoading } = useQuery({
    queryKey: ['donorDonations', currentUser[0]?.email],
    queryFn: async () => {
      const res = await axios.get('projects');
      const historyData = [];
// 
      res.data.forEach((project) => {
        if (project?.donorDetails && Array.isArray(project?.donorDetails)) {
          // Locate transactions matching current user context email parameters
          const matchingReceipts = project?.donorDetails.filter(
            (d) => d?.email == currentUser[0].email
          );
          
          matchingReceipts.forEach((receipt) => {
            historyData.push({
              key: receipt.transactionId,
              projectTitle: project.title,
              amount: receipt.amount,
              date: new Date(receipt.donatedAt).toLocaleDateString(),
              status: receipt.status || 'Approved',
            });
          });
        }
      });
      return historyData;
    },
    // enabled: !!currentUser?.email, // Only runs if user email exists
  });
  console.log(myDonations)

  // 2. Transaction Status URL Parameter Interceptor
  useEffect(() => {
    const status = searchParams.get('status');
    const transactionId = searchParams.get('tran');

    if (status) {
      if (status === 'success') {
        notification.success({
          message: 'Contribution Confirmed!',
          description: `Thank you for your support. Transaction ID: ${transactionId}`,
          placement: 'top',
          duration: 6,
        });
      } else if (status === 'failed') {
        notification.error({
          message: 'Payment Failed',
          description: 'The transaction was rejected by your payment provider. Please verify your details and try again.',
          placement: 'top',
        });
      } else if (status === 'cancelled') {
        notification.warning({
          message: 'Transaction Cancelled',
          description: 'You closed the payment window interface loop session.',
          placement: 'top',
        });
      } else if (status === 'invalid') {
        notification.error({
          message: 'Verification Error',
          description: 'An error occurred while tracking your account mapping validation profiles.',
          placement: 'top',
        });
      }

      // Clean search queries out of the browser address bar immediately
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete('status');
      updatedParams.delete('tran');
      setSearchParams(updatedParams);
    }
  }, [searchParams, setSearchParams]);

  // Calculate stats directly from query data cache
  const totalContribution = myDonations?.reduce((sum, item) => sum + item.amount, 0);

  const columns = [
    { title: 'Transaction Ref', dataIndex: 'key', key: 'key', width: 140, className: 'font-mono text-xs' },
    { title: 'Supported Initiative', dataIndex: 'projectTitle', key: 'projectTitle' },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      render: (val) => <strong className="text-emerald-700">৳ {val.toLocaleString()}</strong>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: () => <Tag color="success" icon={<CheckCircleOutlined />}>SUCCESS</Tag>,
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm bg-slate-50 border border-slate-100 rounded-xl">
            <Statistic
              title="Total Contributed Balance"
              value={totalContribution}
              precision={2}
              prefix={<WalletOutlined className="text-emerald-500 mr-1" />}
              suffix="BDT"
            />
          </Card>
        </Col>
      </Row>

      <Card title={<span className="font-bold text-slate-800 text-sm">Your Funding Contribution History Logs</span>} className="shadow-sm rounded-xl">
        <Table
          dataSource={myDonations} // Fixed: case-sensitive prop from 'datasource' to 'dataSource'
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Card>
    </div>
  );
}