import React from "react";
import { Provider } from "react-redux";
import Action from "../../features/Action";
import ModelViewer from "../../features/ModelViewer";
import ViewerSetting from "../../features/ViewerSetting";
import stores from "../../stores";
import style from './Viewer.module.scss'
import style2 from './viewer2.module.css'

const Viewer = () => {

  return (
    <Provider store={stores}>
      <div>
        <div className={style2.demo}>
          <ModelViewer />
        </div>
        <div>
          <ViewerSetting />
        </div>
        <div>
          <Action />
        </div>
      </div>
    </Provider>
  );
};

export default Viewer;
