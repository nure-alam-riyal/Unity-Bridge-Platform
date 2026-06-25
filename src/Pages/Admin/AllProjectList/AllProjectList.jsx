import React, { useState } from 'react';
import { Modal, Button, message, Input, Tag, Pagination } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, SearchOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';

const AllProjectList = () => {
  const axios = usePublicAxios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['allGlobalProjectsAdminData'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });

 
  const filteredProjects = projects.filter(project => 
    project?.status !== 'draft' &&
    (project?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
     project?.ngoName?.toLowerCase().includes(searchText.toLowerCase()) ||
     project?.ngoEmail?.toLowerCase().includes(searchText.toLowerCase()))
  );

  
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  
  const handleProjectStatus = async (projectId, newStatus, reason = '') => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`projects/verify-status/${projectId}`, {
        status: newStatus,
        rejectionReason: reason
      });

      if (response.data.success) {
        message.success(`Project has been successfully marked as ${newStatus}!`);
        setIsRejectModalOpen(false);
        setRejectReason('');
        refetch(); 
      }
    } catch (error) {
      console.error("Status adjustment error:", error);
      message.error(error.response?.data?.message || "Failed to update project status.");
    } finally {
      setIsUpdating(false);
    }
  };

 
  const getStatusTag = (status) => {
    if (status === 'verified') return <Tag color="success" className="uppercase font-bold">Verified</Tag>;
    if (status === 'rejected') return <Tag color="error" className="uppercase font-bold">Rejected</Tag>;
    if (status === 'published') return <Tag color="processing" className="uppercase font-bold">Published</Tag>;
    return <Tag color="default" className="uppercase font-bold">{status || 'Unknown'}</Tag>;
  };

  const handlePageChange = (page, pSize) => {
    setCurrentPage(page);
    setPageSize(pSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPDF = () => {
    if (filteredProjects.length === 0) {
      message.warning('No projects to export.');
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ['Project Title', 'NGO Name', 'Description', 'Status'];
    const tableRows = filteredProjects.map(project => [
      project.title || 'N/A',
      project.ngoName || 'N/A',
      (project.description || 'N/A').substring(0, 40) + '...',
      project.status || 'N/A'
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
        fontSize: 10
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [240, 245, 250]
      },
      margin: { top: 40 }
    });

    doc.setFontSize(16);
    doc.text('Project Catalog Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 24);
    doc.text(`Total Projects: ${filteredProjects.length}`, 14, 28);

    doc.save(`Project_Catalog_${new Date().toISOString().split('T')[0]}.pdf`);
    message.success('PDF downloaded successfully.');
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error fetching master project logs.</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Project Catalog Manager</h2>
              <p className="text-xs text-slate-500 mt-1">Review and verify all projects across the platform (Drafts excluded)</p>
            </div>
            <div className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-700 px-4 py-2 rounded-lg font-semibold border border-blue-100 self-start sm:self-center">
              Total Projects: <span className="text-lg font-bold text-blue-600">{filteredProjects.length}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <Input
              placeholder="Search by project title, NGO name, or email..."
              prefix={<SearchOutlined className="text-slate-400" />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 rounded-lg text-sm"
              allowClear
            />
            <Button 
              type="primary" 
              icon={<FilePdfOutlined />}
              onClick={handleDownloadPDF}
              className="bg-red-600 hover:bg-red-700 border-none rounded-lg font-semibold"
            >
              Export PDF
            </Button>
          </div>
        </div>

        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4 w-[25%]">Project Title</th>
                <th className="p-4 w-[30%]">Project Description</th>
                <th className="p-4 w-[15%]">NGO Name</th>
                <th className="p-4 w-[10%]">Status</th>
                <th className="p-4 text-center w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {currentProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No verified, rejected, or published project records found.
                  </td>
                </tr>
              ) : (
                currentProjects.map((project) => {
                  const currentStatus = project?.status;

                  return (
                    <tr key={project?._id} className="hover:bg-slate-50/40 transition-colors">
                      
                      <td className="p-4 font-semibold text-slate-800">
                        <button 
                          className="text-[#365CCE] hover:underline text-left font-semibold flex items-center gap-1"
                          onClick={() => {
                            setActiveProject(project); 
                            setIsModalOpen(true);      
                          }}
                        >
                          <EyeOutlined /> {project?.title}
                        </button>
                      </td>

                      <td className="p-4 max-w-xs truncate text-slate-500">
                        {project?.description}
                      </td>

                      <td className="p-4">
                        <div className="font-medium text-slate-700">{project?.ngoName || 'N/A'}</div>
                        <div className="text-slate-400 text-xs">{project?.ngoEmail}</div>
                      </td>

                      <td className="p-4">
                        {getStatusTag(currentStatus)}
                      </td>

                      
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<CheckCircleOutlined />}
                            disabled={currentStatus === 'verified' || isUpdating}
                            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded text-xs h-7 disabled:opacity-50"
                            onClick={() => handleProjectStatus(project?._id, 'verified')}
                          >
                            Verify
                          </Button>
                          <Button 
                            type="primary" 
                            danger 
                            size="small"
                            icon={<CloseCircleOutlined />}
                            disabled={currentStatus === 'rejected' || isUpdating}
                            className="rounded text-xs h-7 disabled:opacity-50"
                            onClick={() => {
                              setSelectedProject(project);
                              setIsRejectModalOpen(true);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        
        {filteredProjects.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-center sm:justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProjects.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['5', '10', '20', '50']}
              className="text-xs sm:text-sm"
            />
          </div>
        )}
      </div>

     
      <ProjectDetails 
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveProject(null);
        }}
        projectData={activeProject}
      />

     
      <Modal
        title={<span className="text-base font-bold text-red-600">State Reason for Project Rejection</span>}
        open={isRejectModalOpen}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
        }}
        footer={[
          <Button key="cancel" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger 
            loading={isUpdating}
            disabled={!rejectReason.trim()}
            onClick={() => handleProjectStatus(selectedProject?._id, 'rejected', rejectReason)}
          >
            Confirm Rejection
          </Button>
        ]}
      >
        <div className="mt-3">
          <p className="text-xs text-slate-500 mb-2">Please provide a transparent justification detailing why this project is being rejected. This feedback will be sent to the submitting NGO.</p>
          <Input.TextArea 
            rows={4} 
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Type rejection justification details here..." 
            className="rounded-lg text-sm"
          />
        </div>
      </Modal>

    </div>
  );
};

export default AllProjectList;