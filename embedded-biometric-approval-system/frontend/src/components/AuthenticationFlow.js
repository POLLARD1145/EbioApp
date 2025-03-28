import React, { useState } from "react";
import { Card, Button, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { authenticateUser } from "../services/api_service";

const AuthenticationFlow = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      message.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticateUser(username, password);
      if (response.success) {
        message.success("Login Successful");
        // Redirect or update app state
        localStorage.setItem("authToken", response.token);
      } else {
        message.error(response.message || "Authentication failed");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Secure Login" className="login-card">
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <Button
          type="primary"
          onClick={handleLogin}
          loading={isLoading}
          className="login-button"
        >
          Login
        </Button>
      </Card>
    </div>
  );
};

export default AuthenticationFlow;
