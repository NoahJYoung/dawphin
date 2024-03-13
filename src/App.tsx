import React from "react";
import { DAW } from "./pages";
import { ConfigProvider } from "antd";
import { token } from "./styles/token";

const App: React.FC = () => {
  return (
    <ConfigProvider theme={token}>
      <DAW />
    </ConfigProvider>
  );
};

export default App;
