import { Collapse } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import CameraSetting from "../CameraSetting";
import EnvironmentSetting from "../EnvironmentSetting";
import MaterialSetting from "../MaterialSetting";
import ModelManager from "../ModelManager";

const { Panel } = Collapse;

interface ViewerSettingProps {}

const ViewerSetting: FunctionComponent<ViewerSettingProps> = () => {
  return (
    <ViewerSettingContainer>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        defaultActiveKey={[
          "selectModelPanel",
          "cameraSettings",
          "materialSettings",
        ]}
      >
        <Panel
          header={<ViewerSettingTitle>Select model</ViewerSettingTitle>}
          key="selectModelPanel"
        >
          <ModelManager />
        </Panel>
        <Panel
          header={<ViewerSettingTitle>Camera settings</ViewerSettingTitle>}
          key="cameraSettings"
        >
          <CameraSetting />
        </Panel>
        <Panel
          header={<ViewerSettingTitle>Environment settings</ViewerSettingTitle>}
          key="environmentSettings"
        >
          <EnvironmentSetting />
        </Panel>
        <Panel
          header={<ViewerSettingTitle>Material settings</ViewerSettingTitle>}
          key="materialSettings"
        >
          <MaterialSetting />
        </Panel>
      </Collapse>
    </ViewerSettingContainer>
  );
};

const ViewerSettingContainer = styled.div``;
const ViewerSettingTitle = styled.div`
  font-weight: bold;
`;

export default ViewerSetting;
