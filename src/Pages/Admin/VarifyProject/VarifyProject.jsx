import React, { useState } from 'react';
import { Modal, Button, message, Input, Descriptions, Tag, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



const VerifyProject = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const axios = usePublicAxios();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('published');
  const [searchText, setSearchText] = useState('');



  // 1. Fetch all projects from the database backend

  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['allProjectsAdminData'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });



  // 2. Filter out projects so that we only deal with ones currently marked as "published"

  const publishedProjects = projects.filter(p => p?.status === statusFilter);

  // 2.5 Further filter by search text (title, NGO name, or email)
  const filteredProjects = publishedProjects.filter(p =>
    p?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    p?.ngoName?.toLowerCase().includes(searchText.toLowerCase()) ||
    p?.ngoEmail?.toLowerCase().includes(searchText.toLowerCase())
  );

  // 3. PDF Download Handler
  const handleDownloadPDF = () => {
    if (filteredProjects.length === 0) {
      message.warning('No projects to download');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(16);
    doc.text('Project Verification List', pageWidth / 2, 15, { align: 'center' });
    
    // Filter info
    doc.setFontSize(10);
    doc.text(`Status: ${statusFilter} | Total Projects: ${filteredProjects.length}`, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);

    // Table data
    const tableData = filteredProjects.map(project => [
      project?.title || 'N/A',
      project?.ngoName || 'N/A',
      project?.ngoEmail || 'N/A',
      project?.status || 'N/A'
    ]);

    // Generate table using autoTable
    autoTable(doc, {
      head: [['Project Title', 'NGO Name', 'NGO Email', 'Status']],
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
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 50 }
      }
    });

    doc.save(`project-list-${statusFilter}-${new Date().getTime()}.pdf`);
    message.success('PDF downloaded successfully!');
  };

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

        setIsDetailModalOpen(false);

        setRejectReason('');

        refetch(); // Reload the table data live

      }

    } catch (error) {

      console.error("Verification adjustment error:", error);

      message.error(error.response?.data?.message || "Failed to update project verification status.");

    } finally {

      setIsUpdating(false);

    }

  };



  if (isLoading) return <Loading />;

  if (isError) return <div className="text-center my-10 text-red-500">Error fetching projects from server logs.</div>;



  return (

    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">

      <div className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">

        

        <div className="p-5 border-b border-slate-100 bg-white">

          <h2 className="text-xl font-bold text-slate-800">Project Verification Dashboard</h2>

          <p className="text-xs text-slate-400">Review newly published incoming NGO projects and accept or reject submissions.</p>

        </div>

        {/* Filter and Search Controls */}
        <div className="p-5 border-b border-slate-100 bg-white space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full"
                options={[
                  { label: 'Published', value: 'published' },
                  { label: 'Verified', value: 'verified' },
                  { label: 'Rejected', value: 'rejected' },
                  { label: 'Completed', value: 'completed' }
                ]}
              />
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <Input
                placeholder="Search by title, NGO name, or email..."
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
              disabled={filteredProjects.length === 0}
            >
              Download PDF
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{filteredProjects.length}</span> of <span className="font-semibold">{publishedProjects.length}</span> projects
          </div>
        </div>



        {/* Dynamic Data Table Mapping Loop */}

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">

                <th className="p-4 w-[25%]">Project Title</th>

                <th className="p-4 w-[35%]">Project Description</th>

                <th className="p-4 w-[15%]">NGO Name</th>

                <th className="p-4 w-[15%]">NGO Email</th>

                <th className="p-4 text-center w-[10%]">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">

              {filteredProjects.length === 0 ? (

                <tr>

                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">

                    No active published project proposals require verification review.

                  </td>

                </tr>

              ) : (

                filteredProjects.map((project) => (

                  <tr key={project?._id} className="hover:bg-slate-50/40 transition-colors">

                    

                    {/* Title with detail view trigger click handler */}

                    <td className="p-4 font-semibold text-slate-800">

                         {/* <Button

                      type="default"

                      icon={<EyeOutlined />}

                      className="w-full h-10 text-slate-700 font-semibold rounded-lg"

                     

                    >

                      View Details

                    </Button> */}

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



                    {/* Description excerpt */}

                    <td className="p-4 max-w-xs truncate text-slate-500">

                      {project?.description}

                    </td>



                    {/* NGO Name */}

                    <td className="p-4 font-medium text-slate-700">{project?.ngoName || 'N/A'}</td>



                    {/* NGO Email */}

                    <td className="p-4 text-slate-500 text-xs">{project?.ngoEmail}</td>



                    {/* Administration Control Interaction Buttons */}

                    <td className="p-4 text-center">

                      <div className="flex items-center justify-center gap-2">

                        <Button 

                          type="primary" 

                          size="small"

                          icon={<CheckCircleOutlined />}

                          disabled={isUpdating}

                          className="bg-emerald-600 hover:bg-emerald-700 border-none rounded text-xs h-7"

                          onClick={() => handleProjectStatus(project?._id, 'verified')}

                        >

                          Verify

                        </Button>

                        <Button 

                          type="primary" 

                          danger 

                          size="small"

                          icon={<CloseCircleOutlined />}

                          disabled={isUpdating}

                          className="rounded text-xs h-7"

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

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>



      {/* 2. POPUP MODAL: EXTENDED PROJECT SUMMARY DOSSIER */}

       <ProjectDetails 

               visible={isModalOpen}

               onClose={() => {

                 setIsModalOpen(false);

                 setActiveProject(null);

               }}

               projectData={activeProject}

             />



      {/* 3. POPUP MODAL: ADMINISTRATIVE REJECTION REASON DIALOGUE FORM */}

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



export default VerifyProject;