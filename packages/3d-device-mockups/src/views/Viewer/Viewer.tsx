import React from "react";
import { Provider } from "react-redux";
import ModelViewer from "../../features/ModelViewer";
import ViewerSetting from "../../features/ViewerSetting";
import stores from "../../stores";

const Viewer = () => {
  return (
    <Provider store={stores}>
      <div>
        <div style={{ height: "400px", backgroundColor: "gray" }}>
          <ModelViewer />
        </div>
        <div>
          <ViewerSetting />
        </div>
      </div>
    </Provider>
  );
};

export default Viewer;
