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
console.log(profile)
  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 m-0">Profile Settings</h2>
            <p className="text-xs text-slate-400 mt-1">View your active platform registration credentials and skill matrices profile.</p>
          </div>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate('/ngo/settings/edit')}
            className="bg-indigo-600 hover:bg-indigo-700 h-10 px-4 rounded-xl font-bold text-xs tracking-wide shadow-sm border-none shrink-0"
          >
            Edit Profile Workspace
          </Button>
        </div>

        {/* CARD CONTAINER */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xs p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
            <Avatar 
              size={90} 
              src={profile?.image} 
              icon={<UserOutlined />} 
              className="bg-indigo-100 text-indigo-600 border border-slate-200 shadow-md shrink-0"
            />
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-black text-slate-800 m-0">{profile.userName}</h3>
              <p className="text-xs font-mono text-slate-400 m-0 flex items-center justify-center sm:justify-start gap-1">
                <MailOutlined className="text-slate-400" /> {profile.email}
              </p>
              <span className="inline-block mt-2 bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase font-extrabold text-[9px] tracking-wider px-3 py-1 rounded-full">
                {profile.role}
              </span>
            </div>
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <TrophyOutlined className="text-indigo-600" /> Core Competency Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.length > 0 ? (
                  profile?.skills?.map((skill, index) => (
                    <span key={index} className="bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-slate-200/50">
                      {skill}
                    </span>
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
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <BookOutlined className="text-indigo-600" /> Academic Education Qualification
                  </div>
                  <p className="text-slate-700 font-semibold m-0 pl-1">{profile.education}</p>
                </div>
                <Divider className="my-0 border-slate-100" />
              </>
            )}

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <IdcardOutlined className="text-indigo-600" /> Biography Overview Scope
              </div>
              <p className="text-slate-600 leading-relaxed m-0 pl-1 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}