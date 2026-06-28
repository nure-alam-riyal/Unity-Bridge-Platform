import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';

import { Button, Tag, message, Input, Select, Pagination } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CloudUploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import ProjectApplication from '../Projectaplication/ProjectApplication';
import useQuerys from '../../../Hooks/useQuerys';

export default function NGOProjects() {
  const axios = usePublicAxios();
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // 1. Fetching user database profile
  const oneuser = useQuerys({ users: "users" });
  const email = oneuser[0]?.email;
console.log(email)
  // 2. DEPENDENT QUERY FIX: The hook is locked in 'idle' status until dynamic context variable holds value
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['projects', email],
    queryFn: () => axios.get(`projects`).then(res => res.data),
    
  });
const projects= data?.filter((p)=>email==p.ngoEmail)
console.log(projects)
  const handlePublish = async (project) => {
    setIsPublishing(true);
    try {
      const updatedPayload = {
        ...project,
        status: 'published',
        date: new Date().toISOString()
      };

      const response = await axios.put(`projects/${project?._id}`, updatedPayload);

      if (response.data) {
        message.success('Project has been published live successfully!');
        refetch();
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      message.error(error.response?.data?.message || "Failed to publish project draft.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Safe fallback triggers while waiting for asynchronous state dependencies to load
  if (!email || isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error loading projects list.</div>;

  const filteredData = projects?.filter((project) => {
    const matchesSearch = project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const projectStatus = project?.status || 'draft';
    const matchesStatus = statusFilter === 'all' || projectStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }) || [];

  const indexOfLastProject = currentPage * pageSize;
  const indexOfFirstProject = indexOfLastProject - pageSize;
  const currentProjects = filteredData.slice(indexOfFirstProject, indexOfLastProject);

  const startRange = filteredData.length === 0 ? 0 : indexOfFirstProject + 1;
  const endRange = Math.min(indexOfLastProject, filteredData.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-6">
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Search by project title or description..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-10 rounded-lg"
            allowClear
          />
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="w-full sm:w-36 flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Show:</span>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="w-full h-10 rounded-lg"
              options={[
                { value: 3, label: '3 / Page' },
                { value: 6, label: '6 / Page' },
                { value: 12, label: '12 / Page' },
                { value: 24, label: '24 / Page' },
              ]}
            />
          </div>
          
          <div className="w-full sm:w-40">
            <Select
              defaultValue="all"
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full h-10 rounded-lg"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'verified', label: 'Verified' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 px-1 text-sm text-slate-500 font-medium">
        <div>
          Showing <span className="text-slate-800 font-semibold">{startRange}-{endRange}</span> of <span className="text-slate-800 font-semibold">{filteredData.length}</span> projects
        </div>
        {filteredData.length > 0 && (
          <div className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
            Page {currentPage} of {Math.ceil(filteredData.length / pageSize)}
          </div>
        )}
      </div>

      {currentProjects.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-xs">
          No projects found matching the criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <div key={project?._id || project?.id}>
              <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">

                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={`${project.projectImages[project.projectImages.length-1]}`||'https://thumbs.dreamstime.com/b/pure-clean-drinking-water-nature-drinkable-fresh-clean-water-sources-119206462.jpg'}
                    alt={project?.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="capitalize">{project?.status || 'draft'}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1 leading-snug group-hover:text-[#0D623B] transition-colors mb-2">
                    {project?.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {project?.description}
                  </p>

                  <div className="flex flex-col gap-2 mt-auto">
                    <div>
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        className="w-full h-10 border-slate-200 hover:border-[#365CCE] hover:text-[#365CCE] text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-1.5"
                        onClick={() => {
                          setActiveProject(project);
                          setIsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="default"
                        icon={<EditOutlined />}
                        className="h-10 border-slate-200 hover:border-amber-500 hover:text-amber-600 text-slate-600 font-medium rounded-lg flex items-center justify-center gap-1"
                      >
                        <Link to={`/ngo/editproject/${project?._id}`}>
                          Edit
                        </Link>
                      </Button>

                      <Button
                        type="primary"
                        icon={<CloudUploadOutlined />}
                        loading={isPublishing}
                        disabled={project?.status === 'published' || project?.status === 'verified' || isPublishing}
                        className="h-10 bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-medium rounded-lg shadow-none flex items-center justify-center gap-1 disabled:bg-slate-100 disabled:text-slate-400"
                        onClick={() => handlePublish(project)}
                      >
                        {project?.status === 'published' ? 'Published' : 'Publish'}
                      </Button>
                    </div>

                    <div>
                      <Button
                        type="default"
                        icon={<EyeOutlined />}
                        className="w-full h-10 border-slate-200 text-slate-700 font-semibold rounded-lg"
                        onClick={() => {
                          setSelectedProject(project); 
                          setIsAppModalOpen(true);      
                        }}
                      >
                        View Applications
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredData.length > pageSize && (
        <div className="flex justify-center mt-10 mb-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}

      <ProjectDetails
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveProject(null);
        }}
        projectData={activeProject}
      />

      <ProjectApplication 
        visible={isAppModalOpen}
        onClose={() => {
          setIsAppModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        refetch={refetch}
      />
    </div>
  );
}