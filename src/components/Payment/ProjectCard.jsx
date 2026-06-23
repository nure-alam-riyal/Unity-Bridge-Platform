// ProjectCard.jsx
import React, { useState } from 'react';
import { Card, Button, Modal, Tag, Divider, message } from 'antd';
import { ThunderboltOutlined, CreditCardOutlined, ShieldCheckOutlined } from '@ant-design/icons';
import usePublicAxios from '../../Hooks/usePublicAxios';

export default function ProjectCard({ project, user }) {
  const axios = usePublicAxios();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingType, setLoadingType] = useState(null);

  const handleCheckout = async (isCardOnly) => {
    setLoadingType(isCardOnly ? 'card' : 'general');
    try {
      const payload = {
        projectId: project?._id,
        amount: project?.budget || 500,
        userEmail: user?.email,
        userName: user?.userName || user?.displayName || 'Anonymous Contributor',
        cardOnly: isCardOnly
      };

      // Request secure session URL from our Node backend
      const response = await axios.post('/payment/initiate', payload);

      if (response.data?.url) {
        message.loading("Redirecting to secure payment channel...", 1.5);
        window.location.replace(response.data.url); // Direct redirect to gateway
      } else {
        throw new Error("Initialization aborted. Token url not found.");
      }
    } catch (error) {
      message.error("Could not reach secure transactional servers.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <>
      <Card
        className="max-w-sm rounded-2xl shadow-md border border-slate-100 bg-white"
        actions={[
          <Button type="primary" block className="bg-emerald-600 font-bold rounded-xl h-10 w-[90%] mx-auto uppercase text-xs" onClick={() => setIsOpen(true)}>
            Donate Now
          </Button>
        ]}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800 truncate">{project?.title}</h3>
            <Tag color="green">VERIFIED</Tag>
          </div>
          <p className="text-slate-500 text-[11px] line-clamp-2">{project?.description}</p>
          <div className="pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Budget</span>
            <span className="text-base font-extrabold text-slate-700">৳{project?.budget} BDT</span>
          </div>
        </div>
      </Card>

      <Modal
        title={<div className="text-sm font-black text-slate-800">Secure Platform Contribution</div>}
        open={isOpen}
        onCancel={() => !loadingType && setIsOpen(false)}
        footer={null}
        centered
        destroyOnClose
      >



        
        <div className="space-y-4 pt-2">
          <div className="text-center bg-emerald-50 border border-emerald-100 py-3 rounded-xl">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase block tracking-wider">Payable Amount</span>
            <span className="text-2xl font-black text-emerald-700">৳{project?.budget} BDT</span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2">
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              loading={loadingType === 'card'}
              disabled={loadingType === 'general'}
              onClick={() => handleCheckout(true)}
              className="w-full bg-slate-950 hover:bg-slate-900 border-none font-bold text-xs h-11 rounded-xl uppercase tracking-wider"
            >
              Pay via Cards (Visa/Mastercard)
            </Button>

            <Button
              icon={<ThunderboltOutlined className="text-amber-500" />}
              loading={loadingType === 'general'}
              disabled={loadingType === 'card'}
              onClick={() => handleCheckout(false)}
              className="w-full font-bold text-xs h-11 rounded-xl uppercase tracking-wider"
            >
              Other Wallets (bKash/Nagad)
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}