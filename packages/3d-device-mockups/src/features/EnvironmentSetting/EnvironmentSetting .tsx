import { Col, InputNumber, Row, Select, Slider } from "antd";
import { FunctionComponent, useEffect } from "react";
import styled from "styled-components";
import { EnvironmentState } from ".";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setEnvironmentPreset, setLightIntensity } from "../ModelViewer/ModelViewerSlide";

const { Option } = Select;

interface EnvironmentSettingProps {}

const EnvironmentSetting: FunctionComponent<EnvironmentSettingProps> = () => {
  const presets: string[] = [
    "sunset",
    "dawn",
    "night",
    "warehouse",
    "forest",
    "apartment",
    "studio",
    "city",
    "park",
    "lobby",
  ];

  const dispatch = useAppDispatch();
  const environmentState: EnvironmentState = useAppSelector(
    (state) => state.modelViewerState.environmentState
  );

  useEffect(() => {}, []);

  const handlePresetChange = (value: any) => {
    const preset = value as string;
    dispatch(setEnvironmentPreset(preset));
  };

  const handleLightIntensityChange = (value: any) => {
    const intensity = value as number;
    dispatch(setLightIntensity(intensity));
  };

  return (
    <EnvironmentSettingContainer>
      <EnvironmentSettingTitle>Preset</EnvironmentSettingTitle>
      <EnvironmentPresets
        value={environmentState.preset}
        onChange={handlePresetChange}
      >
        {presets.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </EnvironmentPresets>
      <div>
      <EnvironmentSettingTitle>Light intensity</EnvironmentSettingTitle>
        <Row>
          <Col span={12}>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={environmentState.lightIntensity}
              onChange={handleLightIntensityChange}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={0}
              max={2}
              step={0.1}
              value={environmentState.lightIntensity}
              onChange={handleLightIntensityChange}
              style={{ margin: "0 16px" }}
            />
          </Col>
        </Row>
      </div>
    </EnvironmentSettingContainer>
  );
};

const EnvironmentSettingContainer = styled.div``;

const EnvironmentSettingTitle = styled.div`
  margin-bottom: 8px;
`;

const EnvironmentPresets = styled(Select)`
  width: 100%;
`;

export default EnvironmentSetting;
