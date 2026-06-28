import React, { useEffect, useState } from 'react';
import useQuerys from '../../../Hooks/useQuerys';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import { Button, message, Input, DatePicker, Tag } from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  FilePdfOutlined,
  UserOutlined,
  TransactionOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    axios.get(`projects`)
      .then((res) => {
        const data = res.data.recentProjects || res.data || [];
        const data1=data.filter((p)=>{
          if(p.ngoEmail==ngoEmail&&p?.donorDetails?.length>0)
            return p
          
        })
        setRecentProjects(data1);
        setLoading(false);
      })

      .catch((err) => {
        setError(err.message || "Failed to fetch donor relations data");
        setLoading(false);
      });
  }, [ngoEmail, axios]);

  console.log(recentProjects)
  const filteredProjects = recentProjects.filter(project => {
    if (dateRange[0] && dateRange[1]) {
      const projectDate = new Date(project.date || project.createdAt);
      const startDate = dateRange[0].toDate();
      const endDate = dateRange[1].toDate();
      endDate.setHours(23, 59, 59, 999);
      if (projectDate < startDate || projectDate > endDate) {
        return false;
      }
    }

    if (searchText) {
      const query = searchText.toLowerCase();
      const projectTitle = ( project?.title || '').toLowerCase();
      const projectId = project?._id
      const matchProject = projectTitle?.includes(query) || projectId?.includes(query);
      
      const targetDonations = project?.donorDetails || project.donations || project.donors || [];
      const matchDonor = targetDonations.some(donation => 
        (donation?.email || donation?.donorName || '').toLowerCase().includes(query) || 
        (donation?.transactionId || '').toLowerCase().includes(query)
      );

      return matchProject || matchDonor;
    }

    return true;
  });

  console.log("=== FILTERED PROJECTS TO BE RENDERED ===", filteredProjects);

  const handleDownloadPDF = () => {
    if (filteredProjects.length === 0) {
      message.warning('No data to download');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(16);
    doc.text('Project Donations & Donor Relations Report', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 23);
    doc.text(`Total Records: ${filteredProjects.length}`, 14, 29);

    let currentY = 35;

    filteredProjects.forEach((project, index) => {
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      const displayTitle =  project?.title|| 'N/A';
      const displayId = project?._id || 'N/A';

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. Project: ${displayTitle} (ID: ${displayId})`, 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(`Budget: BDT ${project.budget?.toLocaleString() || '0'} | Status: ${project.status || 'N/A'}`, 14, currentY + 5);
      
      const donations = project?.donorDetails || [];

      const tableBody = donations.map(d => [
        d?.email ||  'Anonymous Donor',
        d?.transactionId || 'N/A',
        `BDT ${d?.amount?.toLocaleString() || '0'}`,
        d?.donatedAt ? new Date(d.donatedAt).toLocaleDateString() : 'N/A'
      ]);

      if (tableBody.length === 0) {
        tableBody.push([ { content: 'No donation records transactions found for this project.', colSpan: 4, styles: { halign: 'center', textColor: [150, 150, 150] } } ]);
      }

      autoTable(doc, {
        head: [['Donor Email', 'Transaction ID', 'Amount', 'Date']],
        body: tableBody,
        startY: currentY + 8,
        margin: { left: 14, right: 14 },
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181], textColor: 255 },
        styles: { fontSize: 9 },
        didDrawPage: (data) => {
          currentY = data.cursor.y + 12; 
        }
      });
    });

    doc.save(`donor-relations-${new Date().getTime()}.pdf`);
    message.success('Detailed PDF report downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
        <p className="text-xl font-semibold animate-pulse">Loading Donor Relations Metrics...</p>
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
    <div className="min-h-screen bg-slate-900 text-slate-50 p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Donor Relations & Contributions
          </h1>
          <p className="text-slate-400 mt-2">
            Track real-time donor funding allocations, transaction IDs, and project audit trails.
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl mb-6 p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="w-full lg:flex-1">
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Filter by Date Range</label>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates || [null, null])}
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
                className="rounded-lg h-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="w-full lg:flex-1">
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Search Scope</label>
              <Input
                placeholder="Search by Title, ID, Donor Email, or Txn ID..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined className="text-slate-500" />}
                className="rounded-lg h-10 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                allowClear
              />
            </div>

            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={handleDownloadPDF}
              className="w-full lg:w-auto bg-red-600 hover:bg-red-700 border-none h-10 font-semibold rounded-lg px-6"
              disabled={filteredProjects.length === 0}
            >
              Export Report to PDF
            </Button>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
            Showing <span className="font-bold text-indigo-400">{filteredProjects.length}</span> matching target system projects.
          </div>
        </div>

        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-12 text-center text-slate-500 font-medium">
              No verified projects or matching donor transactions located.
            </div>
          ) : (
            filteredProjects.map((project) => {
              const displayTitle =  project?.title || 'Untitled Project';
              const displayId = project?._id ||'N/A';
              const currentDonations = project?.donorDetails || [];

              return (
                <div 
                  key={displayId} 
                  className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/60 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-700/40">
                    <div className="max-w-xl">
                      <h3 className="text-lg font-bold text-white flex flex-wrap items-center gap-2">
                        {displayTitle}
                        <Tag color={project?.status === 'verified' ? 'emerald' : 'gold'} className="uppercase font-mono text-[10px] rounded">
                          {project?.status || 'Pending'}
                        </Tag>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Project ID: <span className="text-indigo-400">{displayId}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="block text-[10px] uppercase text-slate-500 font-bold">Allocated Budget</span>
                        <span className="text-emerald-400 font-bold text-base">৳{project?.budget?.toLocaleString() || '0'}</span>
                      </div>
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        size="middle"
                        className="bg-slate-700/50 hover:bg-slate-700 border-slate-600 hover:border-indigo-500 text-slate-200 rounded-lg text-xs"
                        onClick={() => {
                          setActiveProject(project); 
                          setIsModalOpen(true);      
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 rounded-lg border border-slate-800 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-800/30 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <UserOutlined className="text-indigo-400" /> Associated Donors & Ledger Transactions
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase bg-slate-900/20">
                            <th className="py-2.5 px-4"><UserOutlined className="mr-1" /> Donor Email</th>
                            <th className="py-2.5 px-4"><TransactionOutlined className="mr-1" /> Transaction ID</th>
                            <th className="py-2.5 px-4 text-right"><DollarOutlined className="mr-1" /> Amount Donated</th>
                            <th className="py-2.5 px-4 text-right"><CalendarOutlined className="mr-1" /> Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {currentDonations.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-4 text-center text-slate-600 italic">
                                No donor allocations processed for this workspace yet.
                              </td>
                            </tr>
                          ) : (
                            currentDonations.map((donation, idx) => (
                              <tr key={donation.transactionId || idx} className="hover:bg-slate-800/30 transition-colors">
                                <td className="py-2.5 px-4 font-medium text-slate-200">{donation?.email || donation?.donorName || 'Anonymous Donor'}</td>
                                <td className="py-2.5 px-4 font-mono text-slate-400">{donation.transactionId || 'N/A'}</td>
                                <td className="py-2.5 px-4 text-right font-bold text-emerald-400">৳{donation?.amount?.toLocaleString() || '0'}</td>
                                <td className="py-2.5 px-4 text-right text-slate-400">
                                  {donation?.donatedAt ? new Date(donation.donatedAt).toLocaleDateString() : 'N/A'}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              );
            })
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

      </div>
    </div>
  );
};

export default DonorRelation;