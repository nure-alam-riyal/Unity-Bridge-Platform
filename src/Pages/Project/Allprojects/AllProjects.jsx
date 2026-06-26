import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, message, Input, Select, Pagination } from 'antd';
import {
  EyeOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  SearchOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

import PaymentModal from '../../../components/Payment/PaymentModal';
import useAuth from '../../../Hooks/useAuth';
import useQuerys from '../../../Hooks/useQuerys';
import Loading from '../../../components/Loading';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import ProjectDetails from '../ProjectDetailPage/ProjectDetails';

const { Option } = Select;

export default function AllProjects() {
  const onuser = useQuerys({ users: "users" });
  const axios = usePublicAxios();
  const user=onuser[0]

  const loggedInUserRole = user?.role || onuser[0]?.role || "donor"; 

  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentProject, setSelectedPaymentProject] = useState(null);

  const [localProjects, setLocalProjects] = useState([]);

  const { data,isLoading, isError } = useQuery({
    queryKey: ['projectsData'],
    queryFn: () => axios.get('projects').then(res => {
      setLocalProjects(res.data || []);
      return res.data;
    })
  });
console.log(data)
  const handleVolunteerApply = async (projectId, project) => {
    if (!user || !user.email) {
      return message.error("You must be logged in to submit a volunteer request!");
    }

    if (project?.volunteerCount <= 0) {
      return message.warning("No more volunteers are needed for this project!");
    }

    const currentEmails = project?.volunteerEmail || [];
    const currentDetails = project?.volunteerDetails || [];
    
    const hasAlreadyApplied = currentDetails?.filter((p) => user.email === p.email);

    if (hasAlreadyApplied?.length !== 0) {
      return message.warning("You have already applied to volunteer for this project!");
    }

    const requestDate = new Date().toISOString();
    const volunteerName = onuser[0]?.userName || user?.displayName;

    const newApplication = {
      name: volunteerName,
      email: user.email,
      appliedAt: requestDate,
      id: project?.volunteerDetails?.length || 0,
      status: "applied"
    };

    const updatedCount = (project?.volunteerCount || 1) - 1;

    const payload = {
      ...project,
      volunteerCount: updatedCount,
      volunteerDetails: [...currentDetails, newApplication], 
      volunteerEmail: [...currentEmails, user.email], 
    };

    setLocalProjects(prevProjects => 
      prevProjects?.map(p => p._id === projectId ? { ...p, volunteerCount: updatedCount, volunteerEmail: [...currentEmails, user.email], volunteerDetails: [...currentDetails, newApplication] } : p)
    );

    try {
      const response = await axios.put(`projects/volunteerrequest/${projectId}`, payload);
      if (response.data) {
        message.success("Volunteer request submitted successfully!");
      }
    } catch (error) {
      setLocalProjects(prevProjects => 
        prevProjects.map(p => p._id === projectId ? { ...p, volunteerCount: project.volunteerCount, volunteerEmail: currentEmails, volunteerDetails: currentDetails } : p)
      );
      message.error(error.response?.data?.message || "Failed to submit request.");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error loading projects.</div>;

  
  const verifiedProjects = localProjects?.filter(project => project?.status?.toLowerCase() === 'verified');

  const filteredProjects = verifiedProjects?.filter(project => 
    (project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project?.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (project?.location?.toLowerCase().includes(locationSearch.toLowerCase()) || locationSearch === '')
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'lowToHigh') return Number(a.budget) - Number(b.budget);
    if (sortBy === 'highToLow') return Number(b.budget) - Number(a.budget);
    if (sortBy === 'volunteerNeeded') return Number(b.volunteerCount) - Number(a.volunteerCount);
    return 0; 
  });

  const indexOfLastProject = currentPage * pageSize;
  const indexOfFirstProject = indexOfLastProject - pageSize;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-100 shadow-xs items-center">
          <Input
            placeholder="Search projects by title or description..."
            prefix={<SearchOutlined className="text-slate-400" />}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            className="flex-grow h-10 rounded-lg text-sm"
            allowClear
          />
          <Input
            placeholder="Search by location..."
            prefix={<EnvironmentOutlined className="text-slate-400" />}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow h-10 rounded-lg text-sm"
            allowClear
          />
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Select
              defaultValue="4"
              className="w-full sm:w-40 h-10 rounded-lg"
              onChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <Option value="4">Show: 4 per page</Option>
              <Option value="8">Show: 8 per page</Option>
              <Option value="12">Show: 12 per page</Option>
              <Option value="16">Show: 16 per page</Option>
            </Select>

            <Select
              defaultValue="default"
              className="w-full sm:w-52 h-10 rounded-lg"
              onChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
              <Option value="default">Sort By: Default</Option>
              <Option value="lowToHigh">Budget: Low to High</Option>
              <Option value="highToLow">Budget: High to Low</Option>
              <Option value="volunteerNeeded">Most Volunteers Needed</Option>
            </Select>
          </div>
        </div>

        {currentProjects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No verified projects found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentProjects?.map((project) => {
              const isAdminOrNGO = loggedInUserRole?.toLowerCase() === 'admin' || loggedInUserRole?.toLowerCase() === 'ngo';
              
              const hasAlreadyApplied = project?.volunteerEmail?.includes(user?.email);

              return (
                <div key={project?._id} className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-md transition-all duration-300">

                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={project?.projectImages?.[0] || 'https://thumbs.dreamstime.com/b/pure-clean-drinking-water-nature-drinkable-fresh-clean-water-sources-119206462.jpg'}
                      alt={project?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <TeamOutlined className="text-emerald-400" />
                      <span>{project?.volunteerCount || 0} Volunteers Needed</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-1.5 mb-3 min-h-[22px]">
                      {project?.requiredSkills?.filter(Boolean).slice(0, 2).map((skill, index) => (
                        <span key={index} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-2">{project?.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4 flex-grow">{project?.description}</p>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 mb-4 text-[11px] text-slate-500 font-semibold">
                      <div className="flex items-center gap-1">
                        <DollarOutlined className="text-[#2A7F62]" />
                        <span>Target: ${Number(project?.budget).toLocaleString()}</span>
                      </div>
                      <div className="text-right truncate">
                        <span>Timeline: <strong>{project?.timeline}</strong></span>
                      </div>
                    </div>

                    {project?.location && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-4 pb-3 border-b border-slate-100">
                        <EnvironmentOutlined className="text-[#2A7F62]" />
                        <span className="font-medium">{project.location}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-auto">
                      
                      {/* Volunteer Request Button */}
                      {onuser[0]?.role === "volunteer&donor" && (
                        <Button
                          type="primary"
                          icon={<CloudUploadOutlined />}
                          disabled={hasAlreadyApplied || project?.volunteerCount <= 0}
                          className={`h-10 border-none text-white font-medium rounded-lg flex items-center justify-center gap-1 ${
                            hasAlreadyApplied 
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed pointer-events-none' 
                              : 'bg-[#0D623B] hover:bg-[#09472A]'
                          }`}
                          onClick={() => handleVolunteerApply(project?._id, project)}
                        >
                          {hasAlreadyApplied ? "Already Requested" : "Volunteer Request"}
                        </Button>
                      )}

                      {/* Button Container Layout */}
                      <div className={isAdminOrNGO ? "w-full" : "grid grid-cols-2 gap-2"}>
                        
                        {/* Donate Now Button */}
                        {(onuser[0]?.role === "volunteer&donor" || onuser[0]?.role === "donor") && (
                          <Button 
                            type="default" 
                            icon={<DollarOutlined className="text-emerald-600" />} 
                            className="h-10 text-slate-600 rounded-lg font-semibold hover:border-emerald-500"
                            onClick={() => {
                              setSelectedPaymentProject(project);
                              setIsPaymentModalOpen(true);
                            }}
                          >
                            Donate Now
                          </Button>
                        )}

                        {/* Details Button */}
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
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sortedProjects.length > pageSize && (
          <div className="flex justify-center mt-12">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={sortedProjects.length}
              onChange={(page) => setCurrentPage(page)}
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

        <PaymentModal
          visible={isPaymentModalOpen}
          project={selectedPaymentProject}
          user={user}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPaymentProject(null);
          }}
        />
      </div>
    </div>
  );
}