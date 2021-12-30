import { Button } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { MaterialItemState } from ".";

interface MaterialItemProps {
  materialItemState: MaterialItemState;
  onLoadFrame?: (selectedItem: MaterialItemState) => void;
}

const MaterialItem: FunctionComponent<MaterialItemProps> = ({
  materialItemState,
  onLoadFrame,
}: MaterialItemProps) => {
  const handleLoadFrame = () => {
    onLoadFrame?.(materialItemState);
  };

  return (
    <MaterialItemContainer>
      {/* <div>
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
      </div> */}
      <div>
        <Button block onClick={handleLoadFrame}>
          Get layout
        </Button>
        <Button type="primary" block onClick={handleLoadFrame}>
          Load frame
        </Button>
      </div>
    </MaterialItemContainer>
  );
};

const MaterialItemContainer = styled.div``;

export default MaterialItem;
