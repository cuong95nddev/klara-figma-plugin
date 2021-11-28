import { Collapse } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import MaterialItem, { MaterialItemState } from "../../components/MaterialItem";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateSelectedMaterialUUID } from "./MaterialSettingSlide";

const { Panel } = Collapse;

interface MaterialSettingProps {}

const MaterialSetting: FunctionComponent<MaterialSettingProps> = () => {
  const dispatch = useAppDispatch();

  const materialStates = useAppSelector(
    (state) => state.materialSettingState.materialStates
  );

  const handleLoadFrameClick = (selectedItem: MaterialItemState) => {
    dispatch(updateSelectedMaterialUUID(selectedItem.uuid));
  };

  return (
    <MaterialSettingContainer>
      <Collapse accordion>
        {materialStates.map((materialItem) => (
          <Panel header={materialItem.name} key={materialItem.uuid}>
            <MaterialItem
              key={materialItem.uuid}
              materialItemState={materialItem}
              loadFrameClick={handleLoadFrameClick}
            />
          </Panel>
        ))}
      </Collapse>
    </MaterialSettingContainer>
  );
};

const MaterialSettingContainer = styled.div``;

export default MaterialSetting;
