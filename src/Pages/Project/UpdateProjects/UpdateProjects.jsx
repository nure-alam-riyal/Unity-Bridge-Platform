import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Upload, Tag, message } from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import usePublicAxios from '../../../Hooks/usePublicAxios';
import Loading from '../../../components/Loading';
import { useParams } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import { useImage } from '../../../Hooks/useImage'; // useImage ইম্পোর্ট করা হলো

export default function UpdateProjects() {
  const { user } = useAuth();
  const { id } = useParams();
  const axios = usePublicAxios();
  const [form] = Form.useForm();
  
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [submitType, setSubmitType] = useState('publish'); 
  const [isSubmitting, setIsSubmitting] = useState(false); // সাবমিট লোডিং স্টেট

  // Fetch individual project data payload 
  const { data, isLoading } = useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await axios.get(`projects/${id}`);
      return response?.data;
    }
  });

  // Synchronize form internal state with asynchronous query responses
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      if (data.requiredSkills) {
        setSkills(data.requiredSkills);
      }
    }
  }, [data, form]);

  if (isLoading) {
    return <Loading />;
  }

  // Max 2MB image size handler
  const handleBeforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(`${file.name} ফাইলটি ২MB এর চেয়ে বড়!`);
      return Upload.LIST_IGNORE;
    }
    return false; 
  };

  // Handle adding custom skill tokens on Enter keypress
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  // Handle removing specific skill items
  const handleRemoveSkill = (removedSkill) => {
    setSkills(skills.filter(skill => skill !== removedSkill));
  };

  // Unified Submit Handler for handling both Draft updates and Live Publishing
  const onFinish = async (values) => {
    setIsSubmitting(true);
    let uploadedImageUrls = [];

    try {
      
      if ( values.media.length > 0) {
        message.loading({ content: 'Uploading new project images...', key: 'uploading' });
        
        const uploadPromises = values.media.map(async (file) => {
          return await useImage(file.originFileObj);
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
        message.success({ content: 'All new images uploaded successfully!', key: 'uploading', duration: 2 });
      }

      const { media, ...restValues } = values;

     
      const finalImages = uploadedImageUrls.length > 0 
        ? uploadedImageUrls 
        : (data?.projectImages || ['https://thumbs.dreamstime.com/b/pure-clean-drinking-water-nature-drinkable-fresh-clean-water-sources-119206462.jpg']);

      const updatedPayload = {
        ...restValues,
        projectImages: finalImages,
        requiredSkills: skills,
        ngoEmail: user?.email,
        ngoName: user?.userName || user?.displayName, 
        lastUpdated: new Date().toISOString(),
        status: submitType === 'draft' ? 'draft' : 'published' 
      };

      console.log(`Updating (${submitType.toUpperCase()}):`, updatedPayload);

      // Send updates to the specific document ID via PUT request
      const res = await axios.put(`projects/${id}`, updatedPayload);
      
      if (res.data.modifiedCount > 0 || res.data.acknowledged) {
        if (submitType === 'draft') {
          message.success('Project modifications saved as a draft!');
        } else {
          message.success('Project updates published successfully to live environment!');
        }
      } else {
        message.info('No new modifications detected to update.');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while saving project alterations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 my-4">

      {/* Header Banner Area */}
      <div className="bg-[#F4F8F5] px-6 py-5 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Update Project Details</h1>
        <p className="text-sm text-slate-500 mt-1">Modify scope, tracking metrics, or resource requirements.</p>
      </div>

      {/* Main Form Context Frame */}
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
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
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
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
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
              >
                <InputNumber
                  min={1}
                  prefix={<TeamOutlined className="text-slate-400" />}
                  className="w-full h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg flex items-center"
                />
              </Form.Item>
            </div>
          </div>

          {/* SECTION 3: Project Media (Multiple Upload & 2MB limit  */}
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Project Media
            </h3>
            <Form.Item name="media" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}>
              <Upload.Dragger
                multiple
                listType="picture"
                beforeUpload={handleBeforeUpload}
                className="bg-[#F7FAF8] border-[#E2E8E4] rounded-xl p-4"
              >
                <p className="ant-upload-drag-icon text-2xl text-[#2A7F62]">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text text-sm font-semibold text-slate-700">Click or drag images to this area</p>
                <p className="ant-upload-hint text-xs text-slate-400">Upload new layout gallery images to replace or add to assets. Max size: 2MB per image.</p>
              </Upload.Dragger>
            </Form.Item>
          </div>

          {/* SECTION 4: Impact Goals & Volunteers */}
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Impact Goals & Volunteers
            </h3>

            <Form.Item
              label={<span className="font-semibold text-slate-700 text-sm">Primary Impact Metric</span>}
              name="impactMetric"
            >
              <Input
                placeholder="e.g., Number of families with clean water access"
                className="h-11 bg-[#F7FAF8] border-[#E2E8E4] rounded-lg"
              />
            </Form.Item>

            {/* Dynamic Skill Tag Group Field */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700 text-sm">Required Volunteer Skills</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
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

          {/* Form Action Buttons */}
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
              Publish Updates
            </Button>
          </div>

        </Form>
      </div>
    </div>
  );
}