import React, { useEffect, useState } from 'react';
import useQuerys from '../../../Hooks/useQuerys';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import { Button, message, Input, Select, Pagination } from 'antd';
import {
  EyeOutlined,
  DollarOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  SearchOutlined
} from '@ant-design/icons';
const DonorRelation = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
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
                {recentProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">
                      No project or donor transaction metrics found.
                    </td>
                  </tr>
                ) : (
                  recentProjects.map((project) => (
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