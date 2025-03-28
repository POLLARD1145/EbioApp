import axios from "axios";
import { getSecureHeaders } from "../utils/security_helpers";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://api.yourplatform.com";

export const authenticateUser = async (username, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/login`,
      {
        username,
        password,
      },
      {
        headers: getSecureHeaders(),
      }
    );

    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Authentication failed",
    };
  }
};

export const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {
        refreshToken,
      },
      {
        headers: getSecureHeaders(),
      }
    );

    localStorage.setItem("authToken", response.data.token);
    return response.data.token;
  } catch (error) {
    // Logout user if refresh fails
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
};

export const apiGet = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        ...getSecureHeaders(),
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshAuthToken();
      return apiGet(endpoint);
    }
    throw error;
  }
};

export const apiPost = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        ...getSecureHeaders(),
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshAuthToken();
      return apiPost(endpoint, data);
    }
    throw error;
  }
};
