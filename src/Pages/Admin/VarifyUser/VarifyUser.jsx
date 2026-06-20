import React, { useState } from 'react';
import { Modal, Button, message, Descriptions, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';

const VerifyUser = () => {
  const axios = usePublicAxios();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch all users from your backend database
  const { data: users = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['allUsersData'],
    queryFn: () => axios.get('users').then(res => res.data)
  });

  // 2. Handle updating verification status via direct async call
  const handleVerification = async (userId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`users/verify-status/${userId}`, {
        status: newStatus
      });

      if (response.data.success) {
        message.success(`User verification status updated to ${newStatus}!`);
        
        // Keep detail modal in sync if it is currently viewing the updated user
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(prev => ({ ...prev, status: newStatus }));
        }
        
        refetch(); // Reload the table data live
      }
    } catch (error) {
      console.error("Status update error:", error);
      message.error(error.response?.data?.message || "Failed to alter status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Status Badge helper
  const getStatusBadge = (status) => {
    const currentStatus = status || 'pending';
    if (currentStatus === 'verified') return <Tag color="success" className="uppercase font-bold">Verified</Tag>;
    if (currentStatus === 'fraud') return <Tag color="error" className="uppercase font-bold">⚠️ Fraud</Tag>;
    if (currentStatus === 'rejected') return <Tag color="warning" className="uppercase font-bold">Rejected</Tag>;
    return <Tag color="processing" className="uppercase font-bold">Pending</Tag>;
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-center my-10 text-red-500">Error fetching user registry data.</div>;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-xl border border-slate-100 overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">User Verification Control Panel</h2>
          <p className="text-xs text-slate-400">Review user identity documents and handle verification statuses.</p>
        </div>

        {/* Dynamic HTML Table Loop */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">User Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-center">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No users found in system registry.</td>
                </tr>
              ) : (
                users.map((userItem) => {
                  const currentStatus = userItem?.status || 'pending';

                  return (
                    <tr key={userItem?._id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Name & Detail Trigger */}
                      <td className="p-4 font-semibold text-slate-800">
                        <button 
                          className="text-[#365CCE] hover:underline text-left font-semibold flex items-center gap-1"
                          onClick={() => {
                            setSelectedUser(userItem);
                            setIsModalOpen(true);
                          }}
                        >
                          <EyeOutlined /> {userItem?.name || "Anonymous"}
                        </button>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-slate-500">{userItem?.email}</td>

                      {/* Role */}
                      <td className="p-4 capitalize">
                        <Tag color={userItem?.role === 'admin' ? 'purple' : 'blue'}>
                          {userItem?.role || 'User'}
                        </Tag>
                      </td>

                      {/* Status */}
                      <td className="p-4">{getStatusBadge(currentStatus)}</td>

                      {/* Admin Buttons */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<CheckCircleOutlined />}
                            disabled={currentStatus === 'verified' || isUpdating}
                            className="bg-emerald-600 hover:bg-emerald-700 border-none rounded text-xs"
                            onClick={() => handleVerification(userItem?._id, 'verified')}
                          >
                            Verify
                          </Button>

                          <Button 
                            type="default" 
                            danger
                            size="small"
                            icon={<CloseCircleOutlined />}
                            disabled={currentStatus === 'rejected' || isUpdating}
                            className="rounded text-xs"
                            onClick={() => handleVerification(userItem?._id, 'rejected')}
                          >
                            Reject
                          </Button>

                          <Button 
                            type="primary" 
                            danger
                            size="small"
                            icon={<WarningOutlined />}
                            disabled={currentStatus === 'fraud' || isUpdating}
                            className="bg-red-700 hover:bg-red-800 border-none rounded text-xs"
                            onClick={() => handleVerification(userItem?._id, 'fraud')}
                          >
                            Mark Fraud
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
      </div>

      {/* 2. POPUP MODAL: EXPANDED USER PROFILE SUMMARY DETAILS */}
      <Modal
        title={<span className="text-base font-bold text-slate-800">User Identification Dossier</span>}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        width={600}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>Close</Button>
        ]}
      >
        {selectedUser && (
          <div className="mt-4">
            <Descriptions bordered column={1} size="small" className="bg-slate-50">
              <Descriptions.Item label="System User ID">
                <code className="text-xs bg-slate-100 p-1 rounded">{selectedUser?._id}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">
                <strong>{selectedUser?.name || 'N/A'}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Email Profile">
                {selectedUser?.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Account Role">
                <span className="capitalize font-semibold">{selectedUser?.role || 'User'}</span>
              </Descriptions.Item>
              <Descriptions.Item label="NGO License Number">
                <span className="font-mono text-blue-600 font-semibold">
                  {selectedUser?.ngoLicense || selectedUser?.ngoLicenseNumber || 'Not Applicable / No License'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {selectedUser?.dob || selectedUser?.dateOfBirth 
                  ? new Date(selectedUser.dob || selectedUser.dateOfBirth).toLocaleDateString() 
                  : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {selectedUser?.phone || selectedUser?.phoneNumber || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="NID Number">
                <span className="font-mono tracking-wider">
                  {selectedUser?.nid || selectedUser?.nidNumber || 'N/A'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Verification Status">
                {getStatusBadge(selectedUser?.status)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VerifyUser;