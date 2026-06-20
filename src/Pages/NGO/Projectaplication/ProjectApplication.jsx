import React, { useState } from 'react';
import { Modal, Button, message, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import usePublicAxios from '../../../Hooks/usePublicAxios';

const ProjectApplication = ({ visible, onClose, project, refetch }) => {
  const axios = usePublicAxios();
  const applicants = project?.volunteerDetails || [];
  
  // Local state tracking
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null); // For detail modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Status handler (Accept / Reject)
  const handleStatusChange = async (applicantEmail, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`projects/applicant-status/${project?._id}`, {
        email: applicantEmail,
        status: newStatus,
      });

      if (response.data) {
        message.success(`Applicant status updated to ${newStatus} successfully!`);
        
        // If the profile detail modal is open, update its local viewing state immediately
        if (selectedApplicant && selectedApplicant.email === applicantEmail) {
          setSelectedApplicant(prev => ({ ...prev, status: newStatus }));
        }

        if (refetch) await refetch();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to get status badge classes
  const getBadgeClass = (status) => {
    const currentStatus = status || 'applied';
    if (currentStatus === 'accepted') return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (currentStatus === 'rejected') return "text-rose-700 bg-rose-50 border-rose-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <>
      {/* 1. MASTER LIST MODAL */}
      <Modal
        title={
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">Applications Manager</h2>
            <p className="text-xs text-slate-400 font-normal truncate max-w-[90%]">Project: {project?.title}</p>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose} className="rounded-lg" disabled={isUpdating}>
            Close
          </Button>
        ]}
        width={750}
        className="rounded-xl"
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3">Volunteer Name</th>
                <th className="p-3">Profile (Email)</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-400 bg-white">
                    No applications received for this project yet.
                  </td>
                </tr>
              ) : (
                applicants.map((applicant, index) => {
                  const currentStatus = applicant?.status || 'applied';

                  return (
                    <tr key={applicant.email || index} className="hover:bg-slate-50/40 transition-colors">
                      {/* Name - Clicking this triggers the profile layout details modal */}
                      <td className="p-3 font-semibold text-[#365CCE] hover:underline cursor-pointer flex items-center gap-1.5"
                          onClick={() => {
                            setSelectedApplicant(applicant);
                            setIsProfileModalOpen(true);
                          }}
                      >
                        <UserOutlined className="text-slate-400" />
                        {applicant?.name}
                      </td>
                      
                      <td className="p-3 text-slate-500">
                        {applicant?.email}
                      </td>
                      
                      <td className="p-3">
                        <span className={`inline-block border text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getBadgeClass(currentStatus)}`}>
                          {currentStatus}
                        </span>
                      </td>
                      
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<CheckOutlined />}
                            loading={isUpdating}
                            disabled={currentStatus === 'accepted' || isUpdating}
                            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded flex items-center justify-center text-xs h-7"
                            onClick={() => handleStatusChange(applicant.email, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button 
                            type="primary" 
                            danger 
                            size="small"
                            icon={<CloseOutlined />}
                            loading={isUpdating}
                            disabled={currentStatus === 'rejected' || isUpdating}
                            className="rounded flex items-center justify-center text-xs h-7"
                            onClick={() => handleStatusChange(applicant.email, 'rejected')}
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
      </Modal>

      {/* 2. SUB-MODAL: VOLUNTEER PROFILE DETAILS */}
      <Modal
        title={<span className="text-base font-bold text-slate-800">Volunteer Application Details</span>}
        open={isProfileModalOpen}
        onCancel={() => {
          setIsProfileModalOpen(false);
          setSelectedApplicant(null);
        }}
        width={500}
        footer={[
          <Button 
            key="rej" 
            danger 
            disabled={(selectedApplicant?.status || 'applied') === 'rejected' || isUpdating}
            onClick={() => handleStatusChange(selectedApplicant?.email, 'rejected')}
          >
            Reject Application
          </Button>,
          <Button 
            key="acc" 
            type="primary"
            className="bg-emerald-600 hover:bg-emerald-700 border-none"
            disabled={(selectedApplicant?.status || 'applied') === 'accepted' || isUpdating}
            onClick={() => handleStatusChange(selectedApplicant?.email, 'accepted')}
          >
            Accept Application
          </Button>
        ]}
      >
        {selectedApplicant && (
          <div className="mt-4">
            <Descriptions bordered column={1} size="small" className="bg-slate-50">
              <Descriptions.Item label="Full Name">
                <strong className="text-slate-800">{selectedApplicant.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Email Address">
                {selectedApplicant.email}
              </Descriptions.Item>
              <Descriptions.Item label="Application ID">
                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  {selectedApplicant.id ?? "N/A"}
                </code>
              </Descriptions.Item>
              <Descriptions.Item label="Applied At">
                {selectedApplicant.appliedAt 
                  ? new Date(selectedApplicant.appliedAt).toLocaleString() 
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Current Status">
                <span className={`inline-block border text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getBadgeClass(selectedApplicant.status)}`}>
                  {selectedApplicant.status || 'applied'}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProjectApplication;