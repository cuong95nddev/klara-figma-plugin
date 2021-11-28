import { Collapse } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import EnvironmentSetting from "../EnvironmentSetting";
import MaterialSetting from "../MaterialSetting";
import ModelManager from "../ModelManager";

const { Panel } = Collapse;

interface ViewerSettingProps {}

const ViewerSetting: FunctionComponent<ViewerSettingProps> = () => {
  return (
    <ViewerSettingContainer>
      <Collapse defaultActiveKey={["materialSettings"]}>
        <Panel header="Select model" key="selectModelPanel">
          <ModelManager />
        </Panel>
        <Panel header="Environment settings" key="environmentSettings">
          <EnvironmentSetting />
        </Panel>
        <Panel header="Material settings" key="materialSettings">
          <MaterialSetting />
        </Panel>
      </Collapse>
    </ViewerSettingContainer>
  );
};

const ViewerSettingContainer = styled.div``;

export default ViewerSetting;
