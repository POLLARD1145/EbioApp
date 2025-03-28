import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";

import App from "./App";

// Import Ant Design CSS
//import ".antd/dist/antd.min.css";

// Optional: Custom theme configuration
const theme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 4,
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
