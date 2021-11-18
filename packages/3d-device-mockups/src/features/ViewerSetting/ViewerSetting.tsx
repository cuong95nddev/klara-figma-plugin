import { FunctionComponent } from "react";
import styled from "styled-components";
import ModelManager from "../ModelManager";

interface ViewerSettingProps {}

const ViewerSetting: FunctionComponent<ViewerSettingProps> = () => {
  return (
    <ViewerSettingContainer>
      <ModelManager />
    </ViewerSettingContainer>
  );
};

const ViewerSettingContainer = styled.div``;

export default ViewerSetting;
