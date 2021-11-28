import { Input } from "antd";
import { FunctionComponent, useState } from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";

interface ColorPickerProps {
  color: string;
}

const ColorPicker: FunctionComponent<ColorPickerProps> = ({
  color,
}: ColorPickerProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(color);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: any) => {
    setSelectedColor(color.hex);
  };

  const swatchComponent = (
    <Swatch onClick={handleClick}>
      <Color selectedColor={selectedColor} />
    </Swatch>
  );

  return (
    <ColorPickerContainer>
      <Input addonBefore={swatchComponent} defaultValue="mysite" />
      {displayColorPicker ? (
        <Popover>
          <Cover onClick={handleClose} />
          <SketchPicker color={selectedColor} onChange={handleChange} />
        </Popover>
      ) : null}
    </ColorPickerContainer>
  );
};

const ColorPickerContainer = styled.div`
  position: relative;
`;

const Swatch = styled.div`
  padding: 5px;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  display: inline-block;
  cursor: pointer;
`;

interface ColorProps {
  readonly selectedColor: string;
}

const Color = styled.div<ColorProps>`
  width: 36px;
  height: 14px;
  border-radius: 2px;
  background: ${(props) => props.selectedColor};
`;
const Popover = styled.div`
  position: absolute;
  z-index: 2;
`;
const Cover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

export default ColorPicker;
