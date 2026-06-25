import React, { useState } from 'react';
import { Table, Tabs, Tag, Space, Avatar, Button, message, Popconfirm, DatePicker } from 'antd';
import { UserOutlined, CalendarOutlined, HeartOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

export default function VolunteerdonorList() {
  const axios = usePublicAxios();

  // Pagination states
  const [vCurrentPage, setVCurrentPage] = useState(1);
  const [vPageSize, setVPageSize] = useState(10);
  const [dCurrentPage, setDCurrentPage] = useState(1);
  const [dPageSize, setDPageSize] = useState(10);
  
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  // 1. Fetch Global Project Dataset for Admin Workspace View
  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAllProjectsContributors'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });

  // HELPER FUNCTION: Calculate experience text dynamically from join date (appliedAt)
  const calculateExperience = (joinDateString) => {
    if (!joinDateString) return { text: 'N/A', rawMonths: 0, color: 'default' };
    const joinDate = new Date(joinDateString);
    const currentDate = new Date(); // Dynamic 2026 application runtime context
    const totalMonths = (currentDate.getFullYear() - joinDate.getFullYear()) * 12 + (currentDate.getMonth() - joinDate.getMonth());
    
    if (totalMonths < 1) return { text: 'New Joiner (<1 mo)', rawMonths: 0, color: 'blue' };
    if (totalMonths < 12) return { text: `${totalMonths} Mo Exp`, rawMonths: totalMonths, color: 'cyan' };
    
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    const text = remainingMonths > 0 ? `${years} Yr ${remainingMonths} Mo` : `${years} Yr Exp`;
    return { text, rawMonths: totalMonths, color: years >= 3 ? 'purple' : 'geekblue' };
  };

  // CORE HANDLER: Admin global status management passing exact domain role tags
  const handleUpdateStatus = async (projectId, email, role, newStatus) => {
    setIsActionLoading(true);
    try {
      const response = await axios.put(`projects/update-contributor-status/${projectId}`, {
        email,
        role, // Will cleanly emit either 'volunteer&donor' or 'donor'
        status: newStatus
      });

      if (response.data) {
        message.success(`Status updated to ${newStatus} successfully!`);
        refetch(); // Refetches dataset to instantly synchronize state columns
      }
    } catch (error) {
      console.error("Status update error:", error);
      message.error(error.response?.data?.message || "Failed to alter status state.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter by date range
  const filterByDateRange = (records) => {
    if (!dateRange[0] || !dateRange[1]) return records;
    
    return records.filter(record => {
      const recordDate = new Date(record.appliedAt || record.date);
      const startDate = dateRange[0].toDate();
      const endDate = dateRange[1].toDate();
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      
      return recordDate >= startDate && recordDate <= endDate;
    });
  };

  // PDF Download Handler
  const handleDownloadPDF = (dataType) => {
    const isVolunteer = dataType === 'volunteer';
    const dataSource = isVolunteer ? volunteerDataset : donorDataset;
    const filteredData = filterByDateRange(dataSource);

    if (filteredData.length === 0) {
      message.warning('No data to download');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(16);
    const title = isVolunteer ? 'Volunteers & Donors List' : 'Standalone Donors List';
    doc.text(title, pageWidth / 2, 15, { align: 'center' });
    
    // Filter info
    doc.setFontSize(10);
    let filterText = `Total Records: ${filteredData.length}`;
    if (dateRange[0] && dateRange[1]) {
      filterText += ` | Date Range: ${dateRange[0].format('MMM DD, YYYY')} - ${dateRange[1].format('MMM DD, YYYY')}`;
    }
    doc.text(filterText, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);

    // Table data
    let tableData, columns;
    
    if (isVolunteer) {
      columns = ['Name', 'Email', 'NGO & Project', 'Experience', 'Status'];
      tableData = filteredData.map(volunteer => [
        volunteer.name || 'N/A',
        volunteer.email || 'N/A',
        `${volunteer.projectTitle}\n(NGO: ${volunteer.ngoName})`,
        volunteer.experienceText || 'N/A',
        volunteer.status || 'N/A'
      ]);
    } else {
      columns = ['Name', 'Email', 'NGO & Project', 'Amount', 'Status'];
      tableData = filteredData.map(donor => [
        donor.name || 'N/A',
        donor.email || 'N/A',
        `${donor.projectTitle}\n(NGO: ${donor.ngoName})`,
        `$${donor.amount.toLocaleString()}`,
        donor.status || 'N/A'
      ]);
    }

    // Generate table
    autoTable(doc, {
      head: [columns],
      body: tableData,
      startY: 40,
      margin: { top: 40, right: 14, bottom: 14, left: 14 },
      theme: 'grid',
      headStyles: {
        fillColor: [54, 92, 206],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 45 },
        2: { cellWidth: 50 }
      }
    });

    const fileName = isVolunteer ? 'volunteer-donor-list' : 'standalone-donors-list';
    doc.save(`${fileName}-${new Date().getTime()}.pdf`);
    message.success('PDF downloaded successfully!');
  };

  // 2. PARSE ALL PERSONNEL (Using 'volunteer&donor' structural setup mapping)
  const volunteerDataset = projects.reduce((accumulator, project) => {
    if (Array.isArray(project?.volunteerDetails)) {
      project.volunteerDetails.forEach((volunteer, index) => {
        const expData = calculateExperience(volunteer.appliedAt);
        // Fallback constraint logic: If status is undefined, it renders as Pending Approval
        const currentStatus = volunteer.status || 'Pending Approval';

        accumulator.push({
          key: `vol-${project._id}-${volunteer.email}-${index}`,
          name: volunteer.name,
          email: volunteer.email,
          appliedAt: volunteer.appliedAt,
          experienceText: expData.text,
          rawMonths: expData.rawMonths,
          tagColor: expData.color,
          ngoName: project.ngoName || 'Unknown NGO',
          projectTitle: project.title,
          projectId: project._id,
          status: currentStatus
        });
      });
    }
    return accumulator;
  }, []);

  // Filter volunteer data by date range
  const filteredVolunteerDataset = filterByDateRange(volunteerDataset);

  // 3. PARSE ALL SEPARATE DONORS (Using standalone 'donor' mapping)
  const donorDataset = projects.reduce((accumulator, project) => {
    if (Array.isArray(project?.donorDetails)) {
      project.donorDetails.forEach((donor, index) => {
        const currentStatus = donor.status || 'Pending Approval';
        accumulator.push({
          key: `don-${project._id}-${donor.email}-${index}`,
          name: donor.name,
          email: donor.email,
          amount: donor.amount || 0,
          ngoName: project.ngoName || 'Unknown NGO',
          projectTitle: project.title,
          projectId: project._id,
          date: donor.donatedAt || project.date,
          status: currentStatus
        });
      });
    }
    return accumulator;
  }, []);

  // Filter donor data by date range
  const filteredDonorDataset = filterByDateRange(donorDataset);

  // Dynamic Status Badge Layout Selector Component
  const renderStatusTag = (status) => {
    if (status === 'Verified') return <Tag color="success" className="font-bold uppercase text-[10px]">Verified</Tag>;
    if (status === 'Rejected') return <Tag color="error" className="font-bold uppercase text-[10px]">Rejected</Tag>;
    return <Tag color="warning" className="font-bold uppercase text-[10px]">Pending Approval</Tag>;
  };

  // Table Column Definitions: PERSONNEL (Volunteer & Donor)
  const volunteerColumns = [
    {
      title: 'Volunteer Profile',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
          <div>
            <div className="font-semibold text-slate-800">{text || 'Anonymous'}</div>
            <div className="text-xs text-slate-400">{record?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Assigned NGO & Project Placement',
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      render: (text, record) => (
        <div>
          <div className="font-medium text-slate-700 max-w-[220px] truncate">{text}</div>
          <div className="text-[11px] text-[#365CCE] font-semibold">NGO: {record.ngoName}</div>
        </div>
      ),
    },
    {
      title: 'Experience Level',
      dataIndex: 'experienceText',
      key: 'experienceText',
      sorter: (a, b) => a.rawMonths - b.rawMonths,
      render: (text, record) => <Tag color={record.tagColor} className="font-medium rounded-md">{text}</Tag>,
    },
    {
      title: 'Verification Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatusTag(status),
    },
    {
      title: 'Global Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            disabled={record.status === 'Verified' || isActionLoading}
            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded text-xs h-7"
            onClick={() => handleUpdateStatus(record.projectId, record.email, 'volunteer&donor', 'Verified')}
          >
            Verify
          </Button>
          <Popconfirm
            title="Reject Contributor Globally?"
            onConfirm={() => handleUpdateStatus(record.projectId, record.email, 'volunteer&donor', 'Rejected')}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              disabled={record.status === 'Rejected' || isActionLoading}
              className="rounded text-xs h-7"
            >
              Reject
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Table Column Definitions: EXCLUSIVE DONORS
  const donorColumns = [
    {
      title: 'Donor Benefactor',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar icon={<UserOutlined />} className="bg-purple-100 text-purple-600" />
          <div>
            <div className="font-semibold text-slate-800">{text}</div>
            <div className="text-xs text-slate-400">{record?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Funded NGO & Project Target',
      dataIndex: 'projectTitle',
      key: 'projectTitle',
      render: (text, record) => (
        <div>
          <div className="font-medium text-slate-700 max-w-[220px] truncate">{text}</div>
          <div className="text-[11px] text-[#365CCE] font-semibold">NGO: {record.ngoName}</div>
        </div>
      ),
    },
    {
      title: 'Capital Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => <span className="font-bold text-slate-900 font-mono">${amount.toLocaleString()}</span>,
    },
    {
      title: 'Verification Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatusTag(status),
    },
    {
      title: 'Global Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            disabled={record.status === 'Verified' || isActionLoading}
            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded text-xs h-7"
            onClick={() => handleUpdateStatus(record.projectId, record.email, 'donor', 'Verified')}
          >
            Verify
          </Button>
          <Popconfirm
            title="Reject Funding Entry Globally?"
            onConfirm={() => handleUpdateStatus(record.projectId, record.email, 'donor', 'Rejected')}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              disabled={record.status === 'Rejected' || isActionLoading}
              className="rounded text-xs h-7"
            >
              Reject
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error parsing system-wide stakeholder matrices.</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
        
        {/* Global Admin Monitor Header Block Layout */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Admin Platform Stakeholder Registry</h2>
          <p className="text-xs text-slate-400">Global cross-platform review workspace for monitoring and managing all participating personnel and transactions.</p>
        </div>

        {/* Filter and Download Controls */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Date Range Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Date Range</label>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates || [null, null])}
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
                className="rounded-lg"
              />
            </div>

            {/* Download Buttons */}
            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={() => handleDownloadPDF('volunteer')}
                className="bg-red-600 hover:bg-red-700 border-none rounded"
                disabled={filteredVolunteerDataset.length === 0}
              >
                Download Volunteers
              </Button>
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={() => handleDownloadPDF('donor')}
                className="bg-red-600 hover:bg-red-700 border-none rounded"
                disabled={filteredDonorDataset.length === 0}
              >
                Download Donors
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-600 mt-3">
            <span>Volunteers & Donors: <span className="font-semibold">{filteredVolunteerDataset.length}</span> of <span className="font-semibold">{volunteerDataset.length}</span> | </span>
            <span>Standalone Donors: <span className="font-semibold">{filteredDonorDataset.length}</span> of <span className="font-semibold">{donorDataset.length}</span></span>
          </div>
        </div>

        {/* Tab Panel Segment */}
        <div className="p-4">
          <Tabs 
            defaultActiveKey="1"
            type="line"
            items={[
              {
                key: '1',
                label: (
                  <span className="flex items-center gap-2 px-1 font-medium text-sm">
                    <TeamOutlined /> All Platform Volunteers & Donors ({filteredVolunteerDataset.length})
                  </span>
                ),
                children: (
                  <Table
                    columns={volunteerColumns}
                    dataSource={filteredVolunteerDataset}
                    className="mt-2"
                    pagination={{
                      current: vCurrentPage,
                      pageSize: vPageSize,
                      onChange: (page, pSize) => { setVCurrentPage(page); setVPageSize(pSize); },
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '25']
                    }}
                  />
                ),
              },
              {
                key: '2',
                label: (
                  <span className="flex items-center gap-2 px-1 font-medium text-sm">
                    <HeartOutlined /> Standalone Donors ({filteredDonorDataset.length})
                  </span>
                ),
                children: (
                  <Table
                    columns={donorColumns}
                    dataSource={filteredDonorDataset}
                    className="mt-2"
                    pagination={{
                      current: dCurrentPage,
                      pageSize: dPageSize,
                      onChange: (page, pSize) => { setDCurrentPage(page); setDPageSize(pSize); },
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '25']
                    }}
                  />
                ),
              }
            ]}
          />
        </div>

      </div>
    </div>
  );
}