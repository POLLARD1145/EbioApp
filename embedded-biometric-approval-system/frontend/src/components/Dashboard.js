import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import {
  DollarOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getBlockchainStats } from "../services/blockchain_service";

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalValue: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const blockchainStats = await getBlockchainStats();
        setStats(blockchainStats);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Title level={2}>Dashboard Overview</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={stats.totalTransactions}
              prefix={<TransactionOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Transaction Value"
              value={stats.totalValue}
              precision={2}
              prefix={<DollarOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
