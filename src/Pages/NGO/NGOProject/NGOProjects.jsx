import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import usePublicAxios from '../../../Hooks/usePublicAxios'
import Loading from '../../../components/Loading'

import { Button, Tag, message } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProjectDetails from '../../Project/ProjectDetailPage/ProjectDetails';
import ProjectApplication from '../Projectaplication/ProjectApplication';

export default function NGOProjects() {
  const axios = usePublicAxios()
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: () => axios.get('projects').then(res => res.data)
  });

  // Reuses a standard PUT update endpoint structure to avoid unique backend work
  const handlePublish = async (project) => {
    setIsPublishing(true);
    try {
      // We pass the existing project data but change the status field to 'published'
      const updatedPayload = {
        ...project,
        status: 'published',
        date: new Date().toISOString()
      };

      // Most standard REST backends support updating a record via PUT /projects/:id
      const response = await axios.put(`projects/${project?._id}`, updatedPayload);

      // Check for common backend success indicators (modifiedCount, recognized update, or success flag)
      if (response.data) {
        message.success('Project has been published live successfully!');
        refetch(); // Reload the list data view locally
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      message.error(error.response?.data?.message || "Failed to publish project draft.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error loading projects list.</div>;

  return (
    <div>
      <div className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((project) => (
          <div key={project?._id || project?.id}>
            <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">

              {/* PHOTO CONTAINER */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src='https://thumbs.dreamstime.com/b/pure-clean-drinking-water-nature-drinkable-fresh-clean-water-sources-119206462.jpg'
                  alt={project?.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
                
                {/* Floating Status Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="capitalize">{project?.status || 'draft'}</span>
                </div>
              </div>

              {/* CARD CONTENT LAYER */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1 leading-snug group-hover:text-[#0D623B] transition-colors mb-2">
                  {project?.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {project?.description}
                </p>

                {/* ACTION BUTTON PACK */}
                <div className="flex flex-col gap-2">
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
                      disabled={project?.status === 'published' || isPublishing}
                      className="h-10 bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-medium rounded-lg shadow-none flex items-center justify-center gap-1 disabled:bg-slate-100 disabled:text-slate-400"
                      onClick={() => handlePublish(project)} // Passes the entire original project item object data
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

      {/* Modals Core */}
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
  )
}