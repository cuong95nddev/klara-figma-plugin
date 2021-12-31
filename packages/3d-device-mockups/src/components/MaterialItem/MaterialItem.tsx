import { FormatPainterOutlined } from "@ant-design/icons";
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

      <MaterialItemHeader>
        <MaterialItemTitle>{materialItemState.name}</MaterialItemTitle>
        <div>
          <Button
            icon={<FormatPainterOutlined />}
            type="text"
            onClick={handleLoadFrame}
          />
        </div>
      </MaterialItemHeader>
    </MaterialItemContainer>
  );
};

const MaterialItemContainer = styled.div`
  margin-bottom: 4px;
`;

const MaterialItemHeader = styled.div`
  display: flex;
  align-items: center;
`;

const MaterialItemTitle = styled.div`
  flex-grow: 1;
`;

export default MaterialItem;
