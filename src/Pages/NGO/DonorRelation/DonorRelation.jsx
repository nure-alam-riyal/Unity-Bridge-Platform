import React, { useEffect, useState } from 'react';
import useQuerys from '../../../Hooks/useQuerys';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import { Button, message, Input, Select, Pagination, DatePicker } from 'antd';
import {
  EyeOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  SearchOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
const DonorRelation = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchText, setSearchText] = useState('');
  const oneuser = useQuerys({ users: "users" });
  const ngoEmail = oneuser?.[0]?.email;
  const axios = usePublicAxios();

  useEffect(() => {
    if (!ngoEmail) return;


    setLoading(true);
    
    axios.get(`/ngo/dashboard-summary?email=${ngoEmail}`)
      .then((res) => {
        setRecentProjects(res.data.recentProjects || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch donor relations data");
        setLoading(false);
      });
  }, [ngoEmail, axios]);

  // Filter projects by date range and search text
  const filteredProjects = recentProjects.filter(project => {
    // Date filter
    if (dateRange[0] && dateRange[1]) {
      const projectDate = new Date(project.date || project.createdAt);
      const startDate = dateRange[0].toDate();
      const endDate = dateRange[1].toDate();
      endDate.setHours(23, 59, 59, 999);
      if (projectDate < startDate || projectDate > endDate) {
        return false;
      }
    }

    // Search filter
    if (searchText) {
      return project.name?.toLowerCase().includes(searchText.toLowerCase()) ||
             project.key?.toLowerCase().includes(searchText.toLowerCase());
    }

    return true;
  });

  // PDF Download Handler
  const handleDownloadPDF = () => {
    if (filteredProjects.length === 0) {
      message.warning('No projects to download');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(16);
    doc.text('Donor Relations Report', pageWidth / 2, 15, { align: 'center' });
    
    // Filter info
    doc.setFontSize(10);
    let filterText = `Total Projects: ${filteredProjects.length}`;
    if (dateRange[0] && dateRange[1]) {
      filterText += ` | Date Range: ${dateRange[0].format('MMM DD, YYYY')} - ${dateRange[1].format('MMM DD, YYYY')}`;
    }
    doc.text(filterText, 14, 25);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);

    // Table data
    const tableData = filteredProjects.map(project => [
      project.name || 'N/A',
      project.key || 'N/A',
      `৳${project.budget?.toLocaleString() || '0'}`,
      project.status || 'N/A'
    ]);

    // Generate table
    autoTable(doc, {
      head: [['Project Name', 'Project ID', 'Budget', 'Status']],
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

    doc.save(`donor-relations-${new Date().getTime()}.pdf`);
    message.success('PDF downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Loading Donor Relations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-red-400 flex items-center justify-center">
        <p className="text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Donor Relations
          </h1>
          <p className="text-slate-400 mt-2">
            Overview of projects and donor contributions managed by your organization.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
          <div className="p-4 border-b border-slate-700 bg-slate-700/30 flex flex-col md:flex-row gap-4 items-end">
            {/* Date Range Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Filter by Date Range</label>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates || [null, null])}
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
                className="rounded-lg"
              />
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Search by Name or ID</label>
              <Input
                placeholder="Search projects..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined className="text-slate-400" />}
                className="rounded-lg bg-slate-800 border-slate-600 text-slate-50"
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

          {/* Results Counter */}
          <div className="px-4 py-3 bg-slate-700/20 border-b border-slate-700 text-sm text-slate-300">
            Showing <span className="font-semibold text-slate-50">{filteredProjects.length}</span> of <span className="font-semibold text-slate-50">{recentProjects.length}</span> projects
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700/50 border-b border-slate-700 text-slate-300 font-semibold text-sm uppercase tracking-wider">
                  <th className="py-4 px-6">Project Name</th>
                  <th className="py-4 px-6">Project details</th>
                  
                  <th className="py-4 px-6">Project ID</th>
                  <th className="py-4 px-6">Budget (Allocated)</th>
                  <th className="py-4 px-6">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-slate-200">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">
                      No project or donor transaction metrics found.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.key} className="hover:bg-slate-700/20 transition-colors duration-150">
                      <td className="py-4 px-6 font-medium text-white max-w-xs truncate">
                        {project.name}
                        <Button
                          type="default"
                          icon={<EyeOutlined />}
                          className="w-full h-10 text-slate-700 font-semibold rounded-lg"
                          onClick={() => {
                            setActiveProject(project); 
                            setIsModalOpen(true);      
                          }}
                        >
                          Details
                        </Button>
                      </td>
                      <td>
                         <Button
                          type="default"
                          icon={<EyeOutlined />}
                          className="w-full h-10 text-slate-700 font-semibold rounded-lg"
                          onClick={() => {
                            setActiveProject(project); 
                            setIsModalOpen(true);      
                          }}
                        >
                          Details
                        </Button>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-indigo-400">
                        {project.key}
                      </td>
                      <td className="py-4 px-6 font-semibold text-emerald-400">
                        ৳{project.budget.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm
                          ${project.status === 'verified' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <ProjectDetails
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveProject(null);
          }}
          projectData={activeProject}
        />
        </div>
      </div>
    </div>
  );
};

export default DonorRelation;