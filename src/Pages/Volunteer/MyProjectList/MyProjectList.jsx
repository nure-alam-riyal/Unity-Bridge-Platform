import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useQuerys from '../../../Hooks/useQuerys';
import { data } from 'react-router-dom';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import { Button } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  DollarOutlined
} from '@ant-design/icons';
const MyProjectList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
      const [activeProject, setActiveProject] = useState(null);
    const axios=usePublicAxios()
const usersQuery = useQuerys({ users: "users" });
  const currentUserEmail = usersQuery[0]?.email; // Adjust this key based on your exact auth object structure
console.log(currentUserEmail)
  // 2. Fetch the master projects array list
  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projectsData'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });
console.log(projects)
  // 3. Filter using .some() to see if the user's email exists inside the volunteerDetails array
  const myProjects = projects.filter((project) => {
    const details = project?.volunteerDetails || [];
    console.log(details)
    // .some() returns true immediately if it finds at least ONE match
    return details.some((applicant) => applicant.email === currentUserEmail);
  });
     

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
        
        {/* Table Header Section */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">My Volunteering Applications</h2>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4 w-[25%]">Project Title</th>
                <th className="p-4 w-[25%]">Project </th>

                <th className="p-4 w-[45%]">Project Description</th>
                <th className="p-4 w-[15%]">Applied Date</th>
                <th className="p-4 w-[15%]">Application Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {myProjects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400 font-medium bg-white">
                    You haven’t applied to any volunteer programs yet.
                  </td>
                </tr>
              ) : (
                // 4. Using .map() to loop over your multiple data entries dynamically
                myProjects.map((project) => {
                  // Find this specific logged-in user's nested object entry to isolate their individual application status
                  const dynamicApplicantInfo = project?.volunteerDetails?.find(
                    (applicant) => applicant.email === currentUserEmail
                  );

                  const status = dynamicApplicantInfo?.status || 'Pending';
                  const appliedAt = dynamicApplicantInfo?.appliedAt 
                    ? new Date(dynamicApplicantInfo.appliedAt).toLocaleDateString() 
                    : 'N/A';

                  // Dynamic Badge color config logic based on status string value
                  let badgeStyles = "text-amber-700 bg-amber-50 border-amber-200"; // Pending default
                  if (status.toLowerCase() === 'approved' || status.toLowerCase() === 'accepted') {
                    badgeStyles = "text-emerald-700 bg-emerald-50 border-emerald-200";
                  } else if (status.toLowerCase() === 'rejected') {
                    badgeStyles = "text-rose-700 bg-rose-50 border-rose-200";
                  }

                  return (
                    <tr key={project?._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Title */}
                      <td className="p-4 font-semibold text-slate-800 vertical-top">
                        {project?.title}
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
                      Project Details
                    </Button>
                      </td>
                      
                      {/* Description */}
                      <td className="p-4 max-w-0 truncate text-slate-500">
                        {project?.description}
                      </td>
                      
                      {/* Applied Date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {appliedAt}
                      </td>
                      
                      {/* Status Tag */}
                      <td className="p-4">
                        <span className={`inline-block border text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeStyles}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
             <ProjectDetails 
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveProject(null);
          }}
          projectData={activeProject}
        />
          </table>

        </div>

      </div>
    </div>
    );
};

export default MyProjectList;