import { Col, Row } from "antd";
import React from "react";
import { Provider } from "react-redux";
import styled from "styled-components";
import Action from "../../features/Action";
import ModelViewer from "../../features/ModelViewer";
import ViewerSetting from "../../features/ViewerSetting";
import stores from "../../stores";

const Viewer = () => {
  return (
    <Provider store={stores}>
      <ViewerContainer>
        <Col span="16">
          <ModelViewer />
        </Col>
        <Col span="8">
          <ViewerSetting />
          <Action />
        </Col>
      </ViewerContainer>
    </Provider>
  );
};

const ViewerContainer = styled(Row)`
  width: 100%;
  height: 100%;
`;

export default Viewer;
