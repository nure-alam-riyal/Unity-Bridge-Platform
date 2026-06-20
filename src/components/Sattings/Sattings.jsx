import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Tag, Divider } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined, BookOutlined, TrophyOutlined, EditOutlined } from '@ant-design/icons';
import useAuth from '../../Hooks/useAuth';
import useQuerys from '../../Hooks/useQuerys';

export default function Sattings() {
  const { user } = useAuth();
  const navigate = useNavigate();
const oneuser=useQuerys({users:"users"})
  const isVolunteer = user?.role?.toLowerCase().includes('volunteer');

  const profile = {
    userName: oneuser[0]?.userName||user?.displayName || 'Anonymous User',
    email: oneuser[0]?.email||user?.email || 'notavailable@ecosystem.org',
    role:oneuser[0]?.role|| user?.role || 'volunteer&donor',
    image:  oneuser[0]?.image||user?.photoURL ||'',
    bio: oneuser[0]?.bio||user?.bio || 'No biography details provided yet.',
    skills: oneuser[0]?.skills||user?.skills ||[],
    education: oneuser[0]?.education||user?.education || 'No educational history configured.'
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Profile Settings</h2>
            <p className="text-xs text-slate-400">View your active platform registration credentials and skill matrices profile.</p>
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate('/ngo/settings/edit')}
            className="bg-[#365CCE] hover:bg-blue-700 h-9 rounded-lg font-semibold text-xs tracking-wide shadow-sm"
          >
            Edit Profile Workspace
          </Button>
        </div>

        <Card className="shadow-sm border border-slate-100 rounded-xl bg-white p-2 md:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 mb-6 bg-slate-50/50 rounded-xl border border-slate-100">
            <Avatar 
              size={80} 
              src={profile?.image} 
              icon={<UserOutlined />} 
              className="bg-blue-100 text-blue-600 border border-slate-200 shadow-sm shrink-0"
            />
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-lg font-bold text-slate-800 m-0">{profile.userName}</h3>
              <p className="text-xs font-mono text-slate-400 m-0 flex items-center justify-center sm:justify-start gap-1">
                <MailOutlined /> {profile.email}
              </p>
              <Tag color="blue" className="mt-1 uppercase font-bold text-[10px] tracking-wider px-2.5 py-0.5 rounded-full">
                {profile.role}
              </Tag>
            </div>
          </div>

          <div className="space-y-5 text-sm">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <TrophyOutlined /> Core Competency Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile?.skills?.length > 0 ? (
                  profile?.skills?.map((skill, index) => (
                    <Tag key={index} color="default" className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 border-none rounded-md m-0">
                      {skill}
                    </Tag>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No custom credentials indexed.</span>
                )}
              </div>
            </div>

            <Divider className="my-0 border-slate-100" />

            {isVolunteer && (
              <>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOutlined /> Academic Education Qualification
                  </div>
                  <p className="text-slate-700 font-medium m-0 pl-1">{profile.education}</p>
                </div>
                <Divider className="my-0 border-slate-100" />
              </>
            )}

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <IdcardOutlined /> Biography Overview Scope
              </div>
              <p className="text-slate-600 leading-relaxed m-0 pl-1 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}