import { Button, Slider } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { MaterialItemState } from ".";
import ColorPicker from "../ColorPicker";

interface MaterialItemProps {
  materialItemState: MaterialItemState;
  loadFrameClick?: (selectedItem: MaterialItemState) => void;
}

const MaterialItem: FunctionComponent<MaterialItemProps> = ({
  materialItemState,
  loadFrameClick,
}: MaterialItemProps) => {
  const handleLoadFrame = () => {
    loadFrameClick?.(materialItemState);
  };

  return (
    <MaterialItemContainer>
      <div>
        <ColorPicker color={materialItemState.color} />
      </div>
      <div>
        <p>Roughness</p>
        <Slider min={0} max={100} value={materialItemState.roughness} />
      </div>
      <div>
        <p>Metalness</p>
        <Slider min={0} max={100} value={materialItemState.metalness} />
      </div>
      <div>
        <p>opacity</p>
        <Slider min={0} max={1} step={0.1} value={materialItemState.opacity} />
      </div>
      <div>
        <Button block onClick={handleLoadFrame}>
          Load frame
        </Button>
      </div>
    </MaterialItemContainer>
  );
};

const MaterialItemContainer = styled.div``;

export default MaterialItem;
