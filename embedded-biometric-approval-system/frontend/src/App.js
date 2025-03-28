import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  LockOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

// Import components
import AuthenticationFlow from "./components/AuthenticationFlow";
import TransactionApproval from "./components/TransactionApproval";
import Dashboard from "./components/Dashboard";

const { Header, Content, Sider } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        {isAuthenticated && (
          <Sider width={200} theme="dark">
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<DashboardOutlined />}>
                <a href="/dashboard">Dashboard</a>
              </Menu.Item>
              <Menu.Item key="2" icon={<TransactionOutlined />}>
                <a href="/transactions">Transactions</a>
              </Menu.Item>
              <Menu.Item key="3" icon={<LockOutlined />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu>
          </Sider>
        )}

        <Layout>
          <Header
            style={{
              background: "#fff",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            Web Management Interface
          </Header>

          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
            }}
          >
            <Routes>
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <AuthenticationFlow onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/dashboard" replace />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/transactions"
                element={
                  isAuthenticated ? (
                    <TransactionApproval />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
