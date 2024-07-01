import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, type ThemeConfig } from "antd";

import store from "@/store";

import App from "./App.tsx";

import "./index.less";
import "@/assets/style/common.less";
import "@/assets/icon/index.css";

sessionStorage.setItem(
  "canvasInfo",
  JSON.stringify({
    width: 500,
    height: 600,
  })
);

const config: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    fontFamily: "阿里妈妈方圆体",
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/react-image-editor">
      <Provider store={store}>
        <ConfigProvider theme={config}>
          <App />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
