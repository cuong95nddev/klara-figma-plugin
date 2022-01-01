import { Collapse } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import MaterialItem, { MaterialItemState } from "../../components/MaterialItem";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loadTextureForMaterial } from "./MaterialSettingSlide";

const { Panel } = Collapse;

interface MaterialSettingProps {}

const MaterialSetting: FunctionComponent<MaterialSettingProps> = () => {
  const dispatch = useAppDispatch();

  const materialStates = useAppSelector(
    (state) => state.materialSettingState.materialStates
  );

  const handleLoadFrame = (selectedItem: MaterialItemState) => {
    dispatch(loadTextureForMaterial(selectedItem.id));
  };

  return (
    <MaterialSettingContainer>
      <MaterialList>
        {materialStates.map((materialItem) => (
          <MaterialItem
            key={materialItem.id}
            materialItemState={materialItem}
            onLoadFrame={handleLoadFrame}
          />
        ))}
      </MaterialList>
    </MaterialSettingContainer>
  );
};

const MaterialSettingContainer = styled.div``;

const MaterialList = styled.div``;

export default MaterialSetting;
