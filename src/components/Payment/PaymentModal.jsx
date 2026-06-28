import React, { useState, useEffect } from 'react';
import { Modal, Button, Divider, InputNumber, message } from 'antd';
import { CreditCardOutlined, ThunderboltOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import usePublicAxios from '../../Hooks/usePublicAxios';

export default function PaymentModal({ visible, project, user, onClose }) {
  const axios = usePublicAxios();
  const [loadingType, setLoadingType] = useState(null);
  const [customAmount, setCustomAmount] = useState(500);

  useEffect(() => {
    if (project?.budget) {
      setCustomAmount(Number(project.budget));
    }
  }, [project]);

  const handleCheckout = async (isCardOnly) => {
    if (!user || !user.email) {
      return message.error("Please sign in to make a contribution.");
    }
    if (!customAmount || customAmount <= 0) {
      return message.error("Please enter a valid amount greater than 0 BDT.");
    }

    setLoadingType(isCardOnly ? 'card' : 'general');
    try {
      const payload = {
        projectId: project?._id,
        amount: customAmount,
        userEmail: user?.email,
        userName: user?.userName || 'Anonymous Supporter',
        cardOnly: isCardOnly,
        role: user?.role
      };

      const response = await axios.post('/payment/initiate', payload);
      if (response.data?.url) {
        message.loading("Opening secure SSLCommerz checkout panel...", 1.5);
        // Safely redirect window domain pointer to third-party interface node
        window.location.replace(response.data.url);
      } else {
        throw new Error("Missing callback path routing matrix definitions.");
      }
    } catch (error) {
      message.error("Could not mount checkout window session.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Modal
      title={<div className="text-sm font-black text-slate-800">Secure Project Support Gateway</div>}
      open={visible}
      onCancel={() => !loadingType && onClose()}
      footer={null}
      destroyOnClose
      centered
    >
      <div className="space-y-4 pt-2">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600">
          Target Project: <strong className="text-slate-700">{project?.title}</strong>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
          <label className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">Enter Contribution (BDT)</label>
          <InputNumber
            min={10}
            max={1000000}
            value={customAmount}
            onChange={(val) => setCustomAmount(val)}
            className="w-full max-w-[220px] font-mono text-center font-black text-lg text-emerald-800 rounded-lg mx-auto block"
            size="large"
            formatter={(value) => `৳ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/৳\s?|(,*)/g, '')}
          />
        </div>

        <Divider className="my-1 text-[10px] text-slate-400 font-bold uppercase">Select Gateway Route</Divider>

        <div className="grid grid-cols-1 gap-2">
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            loading={loadingType === 'card'}
            onClick={() => handleCheckout(true)}
            className="w-full bg-slate-950 border-none font-bold text-xs h-11 rounded-xl"
          >
            Pay via Cards
          </Button>

          <Button
            icon={<ThunderboltOutlined className="text-amber-500" />}
            loading={loadingType === 'general'}
            onClick={() => handleCheckout(false)}
            className="w-full font-bold text-xs h-11 rounded-xl"
          >
            Mobile Banking / Wallets
          </Button>
        </div>

        <div className="text-center flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold uppercase">
          <SafetyCertificateOutlined className="text-emerald-500" /> SSLCommerz Encrypted Transaction Loop
        </div>
      </div>
    </Modal>
  );
}