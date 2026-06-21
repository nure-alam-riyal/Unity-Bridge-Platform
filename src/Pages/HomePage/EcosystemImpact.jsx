import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { WalletOutlined, TeamOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function EcosystemImpact() {
  const impactData = [
    {
      id: 1,
      icon: <WalletOutlined style={{ fontSize: '24px', color: '#047857' }} />,
      iconBg: '#ecfdf5', // Light emerald
      value: "$4.2M+",
      label: "TOTAL FUNDS RAISED",
    },
    {
      id: 2,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#4338ca' }} />,
      iconBg: '#e0e7ff', // Light indigo
      value: "12,450",
      label: "ACTIVE VOLUNTEERS",
    },
    {
      id: 3,
      icon: <HeartOutlined style={{ fontSize: '24px', color: '#0f766e' }} />,
      iconBg: '#f0fdfa', // Light teal
      value: "850k+",
      label: "LIVES IMPACTED",
    },
  ];

  // Inline styles to match the custom light green background exactly
  const sectionStyle = {
    backgroundColor: '#eef4ec',
    padding: '64px 24px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
        height: '600px',
  };

  const iconContainerStyle = (bg) => ({
    backgroundColor: bg,
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  });

  const cardStyle = {
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    height: '100%',
  };

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#111827' }}>
          Live Ecosystem Impact
        </Title>
        <Text type="secondary" style={{ display: 'block', fontSize: '14px', marginBottom: '48px', letterSpacing: '0.02em' }}>
          Real-time data verified by our transparency protocol.
        </Text>

        {/* Cards Grid */}
        <Row gutter={[24, 24]} justify="center">
          {impactData.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card hoverable style={cardStyle} styles={{ body: { padding: '32px 24px' } }}>
                
                {/* Custom Icon Wrapper */}
                <div style={iconContainerStyle(item.iconBg)}>
                  {item.icon}
                </div>

                {/* Stat Value */}
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#111827', lineHeight: '1.2', marginBottom: '4px' }}>
                  {item.value}
                </div>

                {/* Stat Label */}
                <Text style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', letterSpacing: '0.1em' }}>
                  {item.label}
                </Text>

              </Card>
            </Col>
          ))}
        </Row>

      </div>
    </section>
  );
}