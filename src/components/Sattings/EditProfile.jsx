import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Input, Form, Select, message, Upload } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, BookOutlined, TrophyOutlined, ArrowLeftOutlined, SaveOutlined, FileTextOutlined, CameraOutlined } from '@ant-design/icons';
import useAuth from '../../Hooks/useAuth';
import usePublicAxios from '../../Hooks/usePublicAxios';
import useQuerys from '../../Hooks/useQuerys';
import { useImage } from '../../Hooks/useImage';

export default function EditProfile() {
  const { user, refetch } = useAuth(); 
  const axios = usePublicAxios();
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // ইমেজ আপলোড লোডিং স্টেট
  const [form] = Form.useForm();
  const [img,setImg]=useState('')
  const oneuser = useQuerys({ users: "users" });
  const userData = oneuser[0] || {};

  // Role evaluations based on database or auth values
  const userRole = userData?.role || user?.role || '';
  const isVolunteerAndDonor = userRole === 'volunteer&donor';
  const isVolunteer = userRole.toLowerCase().includes('volunteer');
  const isNGO = userRole === 'NGO';

  // central fallback baseline values dataset
  const initialFormValues = {
    userName: userData?.userName || user?.displayName || 'Anonymous User',
    email: userData?.email || user?.email || 'notavailable@ecosystem.org',
    role: userRole || 'volunteer&donor',
    image: userData?.image || user?.photoURL || '',
    bio: userData?.bio || user?.bio || 'No biography details provided yet.',
    skills: userData?.skills || user?.skills || [],
    education: userData?.education || user?.education || '',
    license: userData?.license || ''
  };

  // Keep form fields synced automatically when backend user data loads asynchronously
  useEffect(() => {
    if (user || oneuser.length > 0) {
      form.setFieldsValue({
        userName: userData?.userName || user?.displayName || 'Anonymous User',
        email: userData?.email || user?.email || 'notavailable@ecosystem.org',
        role: userRole || 'volunteer&donor',
        image: userData?.image || user?.photoURL || '',
        bio: userData?.bio || user?.bio || '',
        skills: userData?.skills || user?.skills || [],
        education: userData?.education || user?.education || '',
        license: userData?.license || ''
      });
    }
  }, [user, oneuser, form, userRole, userData]);

  // Intercept file picker selection and upload directly to ImgBB
  const handleImageCapture = async (info) => {
    const file = info.file;
    
    // Max 2MB Size Validation
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Profile image must be smaller than 2MB!');
      return;
    }

    try {
      setIsUploading(true);
      message.loading({ content: 'Uploading profile photo...', key: 'profileUpload' });
     
      // single image hosting trigger using custom hook/function
      const hostedUrl = await useImage(file);
    
      if (hostedUrl) {
    setImg(hostedUrl)
        message.success({ content: 'Profile photo hosted successfully!', key: 'profileUpload', duration: 2 });
      } else {
        message.error({ content: 'Failed to host image.', key: 'profileUpload' });
      }
    } catch (err) {
      console.error("Hosting context error:", err);
      message.error({ content: 'Image upload failed.', key: 'profileUpload' });
    } finally {
      setIsUploading(false);
    }
  };

  const onSaveChanges = async (values) => {
    setIsSaving(true);
    
    // SAFETY FALLBACK: If values.image is missing, fallback cleanly to existing image string
    const submissionPayload = {
      ...values,
      image: img || initialFormValues.image
    };

    console.log("Submitting Profile Data:", submissionPayload);

    try {
      const response = await axios.put(`/users/update-profile/${initialFormValues?.email}`, submissionPayload);
      
      if (response.data.success || response.data) {
        message.success('Your profile changes have been saved successfully!');
        if (refetch) await refetch(); 
        navigate('/ngo/settings'); 
      }
    } catch (error) {
      console.error('Profile saving exception:', error);
      message.error(error.response?.data?.message || 'Failed to sync modified profile variables.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/ngo/settings')}
            className="border-slate-200 hover:border-slate-400 text-slate-600 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Profile Workspace</h2>
            <p className="text-xs text-slate-400">Modify your platform public variables and baseline values.</p>
          </div>
        </div>

        <Card className="shadow-sm border border-slate-100 rounded-xl bg-white p-2 md:p-4">
          <Form
            form={form}
            layout="vertical"
            initialValues={initialFormValues}
            onFinish={onSaveChanges}
            requiredMark={false}
          >
            {/* AVATAR & CAMERA UPLOAD WORKFLOW */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 mb-6 bg-slate-50/50 rounded-xl border border-slate-100">
              <div className="relative group cursor-pointer shrink-0">
                <Avatar 
                  size={90} 
                  src={Form.useWatch(userData?.image) || initialFormValues.image} 
                  icon={<UserOutlined />} 
                  className={`bg-blue-100 text-blue-600 border-2 border-white shadow-md ${isUploading ? 'opacity-40' : ''}`}
                />
                <Upload
                  beforeUpload={() => false}
                  onChange={handleImageCapture}
                  showUploadList={false}
                  accept="image/*"
                  disabled={isUploading}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <CameraOutlined className="text-white text-lg" />
                  </div>
                </Upload>
              </div>

              <div className="space-y-2 text-center sm:text-left w-full max-w-md">
                <div className="text-sm font-bold text-slate-700">Profile Photo Asset</div>
                
                <Upload
                  beforeUpload={() => false}
                  onChange={handleImageCapture}
                  showUploadList={false}
                  accept="image/*"
                  disabled={isUploading}
                >
                  <Button size="small" loading={isUploading} icon={<CameraOutlined />} className="rounded-lg text-xs font-medium">
                    {isUploading ? 'Uploading...' : 'Take Photo or Browse Device'}
                  </Button>
                </Upload>

                <Form.Item name="image" noStyle>
                  <Input type="hidden" />
                </Form.Item>
                <p className="text-[11px] text-slate-400 m-0">Click the avatar area or browser triggers to snap a photograph using your active device camera or system storage folders. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <Form.Item 
                label={<span className="font-semibold text-slate-700 text-xs"><UserOutlined className="mr-1" /> Profile Name</span>} 
                name="userName"
                rules={[{ required: true, message: 'Your user profile display name cannot be empty.' }]}
              >
                <Input placeholder="John Doe" className="rounded-lg h-9 text-sm" />
              </Form.Item>

              <Form.Item 
                label={<span className="font-semibold text-slate-400 text-xs"><MailOutlined className="mr-1" /> Account Email (Locked)</span>} 
                name="email"
              >
                <Input disabled className="rounded-lg h-9 bg-slate-100 text-slate-400 font-mono text-xs cursor-not-allowed" />
              </Form.Item>

              <Form.Item 
                label={<span className="font-semibold text-slate-400 text-xs"><IdcardOutlined className="mr-1" /> Platform Privileges (Locked)</span>} 
                name="role"
              >
                <Input disabled className="rounded-lg h-9 bg-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px] cursor-not-allowed" />
              </Form.Item>

              {/* RENDERED ONLY FOR VOLUNTEER&DONOR */}
              {isVolunteerAndDonor && (
                <Form.Item 
                  label={<span className="font-semibold text-slate-700 text-xs"><TrophyOutlined className="mr-1" /> Core Competency Skills</span>} 
                  name="skills"
                >
                  <Select mode="tags" placeholder="Type skills and hit Enter..." className="rounded-lg min-h-[36px]" tokenSeparators={[',']} />
                </Form.Item>
              )}
            </div>

            {/* RENDERED FOR ALL VOLUNTEERS */}
            {isVolunteer && (
              <Form.Item 
                label={<span className="font-semibold text-slate-700 text-xs"><BookOutlined className="mr-1" /> Academic Education Qualification</span>} 
                name="education"
                rules={[{ required: true, message: 'Please write down your active level academic credentials.' }]}
                className="mt-2"
              >
                <Input placeholder="e.g., Bachelor of Science in Information Systems" className="rounded-lg h-9 text-sm" />
              </Form.Item>
            )}

            {/* RENDERED ONLY FOR NGO TO ENTER LICENSES */}
            {isNGO && (
              <Form.Item 
                label={<span className="font-semibold text-slate-700 text-xs"><FileTextOutlined className="mr-1" /> Official NGO Operation License Number</span>} 
                name="license"
                rules={[{ required: true, message: 'NGO profiles require a valid registration license number entry.' }]}
                className="mt-2"
              >
                <Input placeholder="e.g., REG-2026-NGO-88432" className="rounded-lg h-9 text-sm" />
              </Form.Item>
            )}

            <Form.Item label={<span className="font-semibold text-slate-700 text-xs">Biography Overview Scope</span>} name="bio" className="mt-2">
              <Input.TextArea rows={4} placeholder="Tell us about yourself..." className="rounded-lg text-sm" />
            </Form.Item>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button onClick={() => navigate('/ngo/settings')} className="rounded-lg h-10 font-medium text-xs text-slate-500">
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSaving}
                disabled={isUploading} // ইমেজ আপলোড চলাকালীন সাবমিট বন্ধ থাকবে
                icon={<SaveOutlined />}
                className="bg-[#365CCE] hover:bg-blue-700 h-10 px-6 rounded-lg font-bold text-xs tracking-wide shadow-sm"
              >
                Update Profile
              </Button>
            </div>
          </Form>
        </Card>

      </div>
    </div>
  );
}