import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, Tag, message } from 'antd';
import { CalendarOutlined, DollarOutlined, UploadOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import useAuth from '../../../Hooks/useAuth';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import { useImage } from '../../../Hooks/useImage'; 

export default function LaunchProject() {
  const axiosPublic = usePublicAxios();
  const { user } = useAuth();
  const [form] = Form.useForm();
  
  const [skills, setSkills] = useState([]); 
  const [skillInput, setSkillInput] = useState('');
  const [submitType, setSubmitType] = useState('publish'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle adding new custom skill tags
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  // Handle removing skill tags
  const handleRemoveSkill = (removedSkill) => {
    setSkills(skills.filter(skill => skill !== removedSkill));
  };

  
  const handleBeforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(`${file.name}`);
      return Upload.LIST_IGNORE;
    }
    return false; 
  };

  // Unified Form Submit Handler
  const onFinish = async (values) => {
    setIsSubmitting(true);
    let uploadedImageUrls = [];

    try {
    console.log( values.media.length)
      if ( values.media.length > 0) {
        message.loading({ content: 'Uploading project images to ImgBB...', key: 'uploading' });
        
        console.log(values?.media?.fileList)
      const uploadPromises = values?.media.map(async(file) =>{
      return await useImage(file.originFileObj)
     
      
      });
      
        uploadedImageUrls = await Promise.all(uploadPromises);
        
        message.success({ content: 'All images uploaded successfully!', key: 'uploading', duration: 2 });
      }

      // Destructure media out so we don't send the raw AntD file object to the backend
      const { media, ...restValues } = values;
console.log(uploadedImageUrls)
      const finalPayload = {
        ...restValues,
        projectImages: uploadedImageUrls.length > 0 ? uploadedImageUrls : '', // URLs Array
        requiredSkills: skills,
        status: submitType === 'draft' ? 'draft' : 'published',
        ngoEmail: user?.email,
        ngoName: user?.userName || user?.displayName, 
        date: new Date().toISOString()
      };

      console.log(`Submitting (${submitType.toUpperCase()}):`, finalPayload);

      const res = await axiosPublic.post('projects', finalPayload);

      if (res.data.insertedId) {
        if (submitType === 'draft') {
          message.success('Project saved as draft successfully!');
        } else {
          message.success('Project has been published live successfully!');
        }
        
        form.resetFields();
        setSkills([]);
      } else {
        message.error('Failed to register project record. Please try again.');
      }
    } catch (error) {
      console.error("Error creating project:", error);
      message.error('An error occurred while creating the project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 my-4">
      
      {/* Form Header Area */}
      <div className="bg-[#F4F8F5] px-6 py-5 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Project</h1>
        <p className="text-sm text-slate-500 mt-1">Define scope, impact goals, and resource requirements.</p>
      </div>

      {/* Main Interactive Form */}
      <div className="p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="p-6 md:p-8 space-y-8"
        >
          
          {/* SECTION 1: Basic Information */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Basic Information
            </h3>
            
            <Form.Item
              label={<span className="font-semibold text-slate-700 text-sm">Project Title</span>}
              name="title"
              rules={[{ required: true, message: 'Please input a project title' }]}
            >
              <Input 
                placeholder="e.g., Solar Microgrid Installation" 
                className="h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg hover:border-[#2A7F62] focus:border-[#2A7F62]"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-slate-700 text-sm">Project Description</span>}
              name="description"
              rules={[{ required: true, message: 'Please write a brief description' }]}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Briefly describe the initiative and its expected outcomes..." 
                className="bg-[#F7FAF8] border-[#E2E8E4] rounded-lg hover:border-[#2A7F62] focus:border-[#2A7F62]"
              />
            </Form.Item>
          </div>

          {/* SECTION 2: Logistics, Budget & Capacity */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Logistics & Budget
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label={<span className="font-semibold text-slate-700 text-sm">Target Budget (USD)</span>}
                name="budget"
                rules={[{ required: true, message: 'Budget target is required' }]}
              >
                <InputNumber
                  prefix={<DollarOutlined className="text-slate-400" />}
                  placeholder="50,000"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  className="w-full h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg flex items-center"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-slate-700 text-sm">Expected Timeline</span>}
                name="timeline"
                rules={[{ required: true, message: 'Expected timeline is required' }]}
              >
                <Input 
                  prefix={<CalendarOutlined className="text-slate-400 mr-1" />}
                  placeholder="e.g., 6 Months" 
                  className="h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-semibold text-slate-700 text-sm">Volunteers Needed</span>}
                name="volunteerCount"
                initialValue={10}
              >
                <InputNumber
                  min={1}
                  prefix={<TeamOutlined className="text-slate-400" />}
                  className="w-full h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg flex items-center"
                />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="font-semibold text-slate-700 text-sm">Project Location</span>}
              name="location"
              rules={[{ required: true, message: 'Please specify the project location' }]}
            >
              <Input 
                prefix={<EnvironmentOutlined className="text-slate-400 mr-1" />}
                placeholder="e.g., Dhaka, Bangladesh" 
                className="h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg hover:border-[#2A7F62] focus:border-[#2A7F62]"
              />
            </Form.Item>
          </div>

          {/* SECTION 3: Project Media (Multiple Upload & 2MB Limit) */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Project Media
            </h3>
            <Form.Item name="media" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
              <Upload.Dragger 
                multiple={true} 
                listType="picture"
                beforeUpload={handleBeforeUpload} 
                className="bg-[#F7FAF8] border-[#E2E8E4] rounded-xl p-4"
              >
                <p className="ant-upload-drag-icon text-2xl text-[#2A7F62]">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text text-sm font-semibold text-slate-700">Click or drag banner images to this area</p>
                <p className="ant-upload-hint text-xs text-slate-400">You can upload multiple pictures supporting your project. Max size: 2MB per image.</p>
              </Upload.Dragger>
            </Form.Item>
          </div>

          {/* SECTION 4: Impact Goals & Volunteers */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Impact Goals & Volunteers
            </h3>

            <Form.Item
              label={<span className="font-semibold text-slate-700 text-sm">Primary Impact Metric</span>}
              name="impactMetric"
              rules={[{ required: true, message: 'Please specify an impact tracking metric' }]}
            >
              <Input 
                placeholder="e.g., Number of families with clean water access" 
                className="h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg"
              />
            </Form.Item>

            {/* Dynamic Skill Tag Group Field */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700 text-sm">Required Volunteer Skills</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-6">
                {skills.map((skill) => (
                  <Tag 
                    key={skill} 
                    closable 
                    onClose={() => handleRemoveSkill(skill)}
                    className="bg-[#EDF4F0] border-[#D5E6DC] text-[#2E6B4E] rounded-full font-medium px-3 py-0.5 text-sm flex items-center gap-1"
                  >
                    {skill}
                  </Tag>
                ))}
              </div>
              <Input 
                placeholder="Type a skill and press enter..." 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg hover:border-[#2A7F62] focus:border-[#2A7F62]"
              />
            </div>
          </div>

          {/* Form Action Footer Panel */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button 
              htmlType="submit"
              disabled={isSubmitting}
              onClick={() => setSubmitType('draft')}
              className="h-11 px-6 border-[#365CCE] text-[#365CCE] font-semibold rounded-lg hover:text-[#25419A] hover:border-[#25419A]"
            >
              Save as Draft
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isSubmitting}
              onClick={() => setSubmitType('publish')}
              className="h-11 px-6 bg-[#0D623B] hover:bg-[#09472A] border-none text-white font-semibold rounded-lg shadow-none"
            >
              Publish Project
            </Button>
          </div>

        </Form>
      </div>
    </div>
  );
}