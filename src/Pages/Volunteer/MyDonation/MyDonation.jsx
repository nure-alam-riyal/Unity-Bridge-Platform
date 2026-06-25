import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notification, Typography, Card, Row, Col, Statistic, Table, Tag, Button, DatePicker } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, DollarCircleOutlined, SafetyCertificateOutlined, HistoryOutlined, FilePdfOutlined } from '@ant-design/icons';
import useAuth from '../../../Hooks/useAuth';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function MyDonation() {
  const { user } = useAuth();
  const axios = usePublicAxios();
  const [searchParams] = useSearchParams();
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);

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
                    donatedAt: new Date(donor.donatedAt),
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

  const filteredByDate = history.filter(donation => {
    if (!dateRange[0] || !dateRange[1]) return true;
    const donationDate = new Date(donation.donatedAt);
    return donationDate >= dateRange[0] && donationDate <= dateRange[1];
  });

  const handleDownloadPDF = () => {
    if (filteredByDate.length === 0) {
      notification.warning({ message: 'No Data', description: 'No donations to export.' });
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ['Project', 'Transaction ID', 'Date', 'Amount (BDT)', 'Status'];
    const tableRows = filteredByDate.map(donation => [
      donation.projectTitle,
      donation.key,
      donation.date,
      `৳${donation.amount}`,
      donation.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 35, 126],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 11
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [240, 245, 250]
      },
      margin: { top: 40 }
    });

    doc.setFontSize(16);
    doc.text('Donation History Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 24);
    doc.text(`Total Donated: ৳${filteredByDate.reduce((sum, d) => sum + Number(d.amount), 0)}`, 14, 28);

    doc.save(`Donation_History_${new Date().toISOString().split('T')[0]}.pdf`);
    notification.success({ message: 'Export Successful', description: 'PDF downloaded successfully.' });
  };

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
        <Tag color="emerald" className="font-bold py-1 px-3"><SafetyCertificateOutlined /> Gateway Synced</Tag>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card className="rounded-xl shadow-sm">
            <Statistic title="Total Capital Contributed" value={totalAmount} suffix=" BDT" prefix={<DollarCircleOutlined className="text-emerald-500" />} />
          </Card>
        </Col>
      </Row>

      <Card title={<div className="text-xs uppercase font-bold tracking-wider"><HistoryOutlined /> Safe Settlement Ledger</div>} className="rounded-xl shadow-sm" extra={<Button type="primary" icon={<FilePdfOutlined />} onClick={handleDownloadPDF} className="bg-emerald-600 hover:bg-emerald-700">Download PDF</Button>}>
        <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Date Range</label>
          <DatePicker.RangePicker
            value={dateRange[0] && dateRange[1] ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : [null, null]}
            onChange={(dates) => {
              if (dates) {
                setDateRange([dates[0]?.toDate(), dates[1]?.toDate()]);
              } else {
                setDateRange([null, null]);
              }
            }}
            className="w-full"
            format="DD/MM/YYYY"
          />
        </div>
        <Table columns={columns} dataSource={filteredByDate} loading={loading} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
}