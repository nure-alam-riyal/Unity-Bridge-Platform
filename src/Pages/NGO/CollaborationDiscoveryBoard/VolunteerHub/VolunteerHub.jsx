import React, { useState } from 'react';
import { Table, Button, Space, Modal, Input, message, Avatar, Tag, Select } from 'antd';
import { UserOutlined, EyeOutlined, CloseCircleOutlined, SolutionOutlined, CalendarOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../../Hooks/usePublicAxios';
import useAuth from '../../../../Hooks/useAuth'; // <-- Import your authentication hook here
import Loading from '../../../../components/Loading';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function VolunteerHub() {
  const axios = usePublicAxios();
  const { user } = useAuth(); // <-- Extract the logged-in NGO user object
  const currentNgoEmail = user?.email; // Get the email of the logged-in NGO

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [rejectReason, setRejectReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState(''); // Filter by volunteer status
  const [searchText, setSearchText] = useState(''); // Add search state

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Fetch projects from the database backend
  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['projectsWithVolunteers'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });

  // HELPER FUNCTION: Calculate experience text dynamically from appliedAt (Join Date)
  const calculateExperience = (joinDateString) => {
    if (!joinDateString) return { text: 'N/A', rawMonths: 0, color: 'default' };
    
    const joinDate = new Date(joinDateString);
    const currentDate = new Date();
    
    const totalMonths = (currentDate.getFullYear() - joinDate.getFullYear()) * 12 + (currentDate.getMonth() - joinDate.getMonth());
    
    if (totalMonths < 1) {
      return { text: 'New Joiner (<1 mo)', rawMonths: 0, color: 'blue' };
    } else if (totalMonths < 12) {
      return { text: `${totalMonths} Mo Exp`, rawMonths: totalMonths, color: 'cyan' };
    } else {
      const years = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      const text = remainingMonths > 0 ? `${years} Yr ${remainingMonths} Mo Exp` : `${years} Yr Exp`;
      return { text, rawMonths: totalMonths, color: years >= 3 ? 'purple' : 'geekblue' };
    }
  };

  // 2. FILTER & FLATTEN LOGIC: Only pull volunteers from projects matching this NGO's email
  const flatVolunteersList = projects.reduce((accumulator, project) => {
    // CRITICAL SECURITY FILTER: Only look inside projects belonging to the logged-in NGO
    if (project?.ngoEmail === currentNgoEmail && Array.isArray(project?.volunteerDetails)) {
      project.volunteerDetails.forEach((volunteer, index) => {
        const expData = calculateExperience(volunteer.appliedAt);

        accumulator.push({
          key: `${project._id}-${volunteer.email}-${index}`,
          name: volunteer.name,
          email: volunteer.email,
          appliedAt: volunteer.appliedAt,
          experience: expData.text,
          rawMonths: expData.rawMonths,
          tagColor: expData.color,
          associatedProjectTitle: project.title,
          associatedProjectId: project._id
        });
      });
    }
    return accumulator;
  }, []);

  // Filter by status
  const filteredVolunteersList = statusFilter 
    ? flatVolunteersList.filter(volunteer => volunteer.associatedProjectTitle) // Placeholder - volunteers don't have explicit status in your data structure
    : flatVolunteersList;

  // Filter by search text (name or email)
  const searchFilteredVolunteersList = searchText.trim()
    ? filteredVolunteersList.filter(volunteer =>
        volunteer.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        volunteer.email?.toLowerCase().includes(searchText.toLowerCase())
      )
    : filteredVolunteersList;

  // PDF Download Handler
  const handleDownloadPDF = () => {
    if (searchFilteredVolunteersList.length === 0) {
      message.warning('No volunteers to download');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(16);
    doc.text('Your NGO Volunteers List', pageWidth / 2, 15, { align: 'center' });
    
    // Filter info
    doc.setFontSize(10);
    doc.text(`Total Volunteers: ${searchFilteredVolunteersList.length}`, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);

    // Table data
    const tableData = searchFilteredVolunteersList.map(volunteer => [
      volunteer.name || 'N/A',
      volunteer.email || 'N/A',
      volunteer.associatedProjectTitle || 'N/A',
      volunteer.experience || 'N/A',
      volunteer.appliedAt ? new Date(volunteer.appliedAt).toLocaleDateString() : 'N/A'
    ]);

    // Generate table
    autoTable(doc, {
      head: [['Name', 'Email', 'Project', 'Experience', 'Applied Date']],
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
      }
    });

    doc.save(`volunteers-list-${new Date().getTime()}.pdf`);
    message.success('PDF downloaded successfully!');
  };

  // 3. Handle rejecting/removing a volunteer
  const handleRejectVolunteer = async () => {
    if (!rejectReason.trim() || !selectedRecord) return;
    setIsUpdating(true);
    try {
      const response = await axios.put(`projects/remove-volunteer/${selectedRecord.associatedProjectId}`, {
        volunteerEmail: selectedRecord.email,
        rejectionReason: rejectReason
      });

      if (response.data) {
        message.success(`${selectedRecord.name} has been removed from your project.`);
        setIsRejectModalOpen(false);
        setRejectReason('');
        setSelectedRecord(null);
        refetch(); 
      }
    } catch (error) {
      console.error("Error removing volunteer:", error);
      message.error(error.response?.data?.message || "Failed to remove volunteer assignment.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Ant Design Table Columns Configuration
  const columns = [
    {
      title: 'Volunteer Profile',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar icon={<UserOutlined />} className="bg-slate-200 text-slate-600" />
          <div>
            <div className="font-semibold text-slate-800">{text || 'Anonymous'}</div>
            <div className="text-xs text-slate-400">{record?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Your Project Context',
      dataIndex: 'associatedProjectTitle',
      key: 'associatedProjectTitle',
      render: (projectTitle) => (
        <span className="font-medium text-slate-700 line-clamp-1 max-w-[220px]">
          {projectTitle}
        </span>
      ),
    },
    {
      title: 'Calculated Experience',
      dataIndex: 'experience',
      key: 'experience',
      sorter: (a, b) => a.rawMonths - b.rawMonths,
      render: (text, record) => (
        <Tag color={record.tagColor} className="font-medium rounded-md px-2.5 py-0.5">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Application Date',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (dateString) => (
        <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
          <CalendarOutlined />
          {dateString ? new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Administrative Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            icon={<EyeOutlined />}
            className="text-slate-600 hover:text-[#365CCE] border-slate-200 hover:border-[#365CCE] rounded text-xs"
            onClick={() => {
              setSelectedRecord(record);
              setIsDetailModalOpen(true);
            }}
          >
            Details
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            className="rounded text-xs"
            onClick={() => {
              setSelectedRecord(record);
              setIsRejectModalOpen(true);
            }}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error extracting volunteer profiles.</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
        
        {/* Component Header Metadata Card */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Your NGO's Volunteers</h2>
              <p className="text-xs text-slate-400">Manage active volunteer applications across your hosted projects only.</p>
            </div>
            <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-medium self-start sm:self-center">
              Your Active Volunteers: <span className="font-bold text-slate-900">{searchFilteredVolunteersList.length}</span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search by Name or Email</label>
              <Input
                placeholder="Search volunteers..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="rounded-lg"
              />
            </div>

            {/* Download PDF Button */}
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleDownloadPDF}
              className="bg-red-600 hover:bg-red-700 border-none rounded"
              disabled={searchFilteredVolunteersList.length === 0}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Ant Design Table */}
        <Table
          columns={columns}
          dataSource={searchFilteredVolunteersList}
          className="p-2"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: (page, pSize) => {
              setCurrentPage(page);
              setPageSize(pSize);
            },
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            className: "pr-4"
          }}
        />
      </div>

      {/* 1. POPUP MODAL: EXTENDED VOLUNTEER BIO DETAILS */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-800">
            <SolutionOutlined className="text-[#365CCE]" />
            <span>Volunteer Assignment Profile Documentation</span>
          </div>
        }
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedRecord(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>Close Dossier</Button>
        ]}
        width={500}
      >
        {selectedRecord && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Avatar size={50} icon={<UserOutlined />} className="bg-slate-200 text-slate-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedRecord?.name || 'Anonymous'}</h4>
                <p className="text-xs text-slate-400">{selectedRecord?.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div>
                <span className="font-bold text-slate-700 block text-xs uppercase tracking-wider mb-1">Target Project Placement</span>
                <p className="bg-blue-50/50 text-[#365CCE] px-3 py-2 rounded-lg border border-blue-100 text-xs font-semibold">
                  Working on: {selectedRecord?.associatedProjectTitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-700 block text-xs uppercase tracking-wider mb-1">Calculated Seniority</span>
                  <Tag color={selectedRecord?.tagColor} className="m-0 font-semibold">{selectedRecord?.experience}</Tag>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block text-xs uppercase tracking-wider mb-1">System Join Date</span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">
                    {selectedRecord?.appliedAt ? new Date(selectedRecord.appliedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. POPUP MODAL: PROJECT DEPLOYMENT REMOVAL / REJECTION PROMPT */}
      <Modal
        title={<span className="text-base font-bold text-red-600">Confirm Project Volunteer Assignment Rejection</span>}
        open={isRejectModalOpen}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
          setSelectedRecord(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsRejectModalOpen(false)}>Cancel Action</Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger 
            loading={isUpdating}
            disabled={!rejectReason.trim()}
            onClick={handleRejectVolunteer}
          >
            Confirm Rejection Status
          </Button>
        ]}
      >
        <div className="mt-3">
          <p className="text-xs text-slate-500 mb-2">
            Are you sure you want to dismiss <strong>{selectedRecord?.name || 'this volunteer'}</strong> from working on your project <strong>"{selectedRecord?.associatedProjectTitle}"</strong>? Please provide a reason below:
          </p>
          <Input.TextArea 
            rows={4} 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Type project assignment rejection reasoning details here..." 
            className="rounded-lg text-sm"
          />
        </div>
      </Modal>

    </div>
  );
}