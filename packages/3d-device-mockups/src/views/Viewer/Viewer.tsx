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
        <Col span="15">
          <ModelViewer />
        </Col>
        <LeftContainer span="9">
          <SettingSection>
            <ViewerSetting />
          </SettingSection>
          <ActionSection>
            <Action />
          </ActionSection>
        </LeftContainer>
      </ViewerContainer>
    </Provider>
  );
};

const ViewerContainer = styled(Row)`
  width: 100%;
  height: 100%;
`;

const LeftContainer = styled(Col)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SettingSection = styled.div`
  flex: 1;
  overflow: auto;
`;

const ActionSection = styled.div``;

export default Viewer;
