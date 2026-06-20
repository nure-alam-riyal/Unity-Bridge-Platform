import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
;
import { Button, message } from 'antd';
import {
  EyeOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  TeamOutlined
} from '@ant-design/icons';


import PaymentModal from '../../../components/Payment/PaymentModal';
import useAuth from '../../../Hooks/useAuth';
import useQuerys from '../../../Hooks/useQuerys';
;
import Loading from '../../../components/Loading';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import ProjectDetails from '../ProjectDetailPage/ProjectDetails';
 // <-- Import the newly created Modal handler component

export default function AllProjects() {
  const onuser = useQuerys({ users: "users" });
  const axios = usePublicAxios();
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  // States to explicitly handle the Donation Modal Flow
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentProject, setSelectedPaymentProject] = useState(null);

  // 1. Fetching All Projects
  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projectsData'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });

  // Handle Volunteer Submissions
  const handleVolunteerApply = async (projectId, project) => {
    if (!user || !user.email) {
      return message.error("You must be logged in to submit a volunteer request!");
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

    const payload = {
      ...project,
      volunteerDetails: [...currentDetails, newApplication], 
      volunteerEmail: [...currentEmails, user.email], 
    };

    try {
      const response = await axios.put(`projects/volunteerrequest/${projectId}`, payload);
      if (response.data) {
        message.success("Volunteer request submitted successfully!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to submit request.");
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error loading projects.</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects?.map((project) => (
            <div key={project?._id} className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-md transition-all duration-300">

              {/* PHOTO CONTAINER */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src='https://thumbs.dreamstime.com/b/pure-clean-drinking-water-nature-drinkable-fresh-clean-water-sources-119206462.jpg'
                  alt={project?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TeamOutlined className="text-emerald-400" />
                  <span>{project?.volunteerCount || 0} Volunteers Needed</span>
                </div>
              </div>

              {/* CARD BODY CONTENT */}
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

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-2 mt-auto">
                  <Button
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    className="h-10 bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-medium rounded-lg flex items-center justify-center gap-1"
                    onClick={() => handleVolunteerApply(project?._id, project)}
                  >
                    Volunteer Request
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    {/* ⚡ ACTIVATES TRANSACTION DIALOG MODAL ON CLICK */}
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
          ))}
        </div>

        {/* View Details Drawer/Modal */}
        <ProjectDetails 
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveProject(null);
          }}
          projectData={activeProject}
        />

        {/* 💳 DYNAMIC SSLCOMMERZ TRANSACTION HANDLER MODAL CONTAINER */}
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