import {
  ArrowLeftOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { Button, InputNumber } from "antd";
import { FunctionComponent, useEffect } from "react";
import styled from "styled-components";
import { CameraState } from "../../components/Camera";
import { useAppDispatch, useAppSelector, useInputValue } from "../../hooks";
import { Vector3 } from "../../types/Vector";
import {
  updateCameraState,
  updateModelRotation,
} from "../ModelViewer/ModelViewerSlide";
import { triggerResetCamera } from "./CameraSettingSlide";

interface CameraSettingProps {}

const CameraSetting: FunctionComponent<CameraSettingProps> = () => {
  const dispatch = useAppDispatch();

  const cameraState: CameraState = useAppSelector(
    (state) => state.modelViewerState.cameraState
  );

  const modeRotationState: Vector3 = useAppSelector(
    (state) => state.modelViewerState.modelState.rotation
  );

  const angleAzimuthInput = useInputValue(cameraState.angle.azimuth);
  const anglePolarInput = useInputValue(cameraState.angle.polar);
  const distanceInput = useInputValue(cameraState.distance);

  useEffect(() => {
    dispatch(
      updateCameraState({
        angle: {
          azimuth: Number(angleAzimuthInput.value),
          polar: Number(anglePolarInput.value),
        },
        distance: Number(distanceInput.value),
      })
    );
  }, [angleAzimuthInput.value, anglePolarInput.value, distanceInput.value]);

  const modelRotationX = useInputValue(modeRotationState.x);
  const modelRotationY = useInputValue(modeRotationState.y);
  const modelRotationZ = useInputValue(modeRotationState.z);

  useEffect(() => {
    dispatch(
      updateModelRotation({
        x: Number(modelRotationX.value),
        y: Number(modelRotationY.value),
        z: Number(modelRotationZ.value),
      })
    );
  }, [modelRotationX.value, modelRotationY.value, modelRotationZ.value]);

  const handleResetCamera = (): void => {
    dispatch(triggerResetCamera());
  };

  return (
    <CameraSettingContainer>
      <CameraSettingGroup>
        <CameraSettingTitle>Device rotation</CameraSettingTitle>
        <CameraSettingInputGroup>
          <CameraSettingInput
            {...modelRotationX}
            defaultValue={0}
            step={0.05}
            prefix={<ArrowUpOutlined />}
          />
          <CameraSettingInput
            {...modelRotationY}
            defaultValue={0}
            step={0.05}
            prefix={<ArrowLeftOutlined />}
          />
          <CameraSettingInput
            {...modelRotationZ}
            defaultValue={0}
            step={0.05}
            prefix={<ReloadOutlined />}
          />
        </CameraSettingInputGroup>
      </CameraSettingGroup>

      <CameraSettingGroup>
        <CameraSettingTitle>Camera rotation</CameraSettingTitle>
        <CameraSettingInputGroup>
          <CameraSettingInput
            {...anglePolarInput}
            defaultValue={0}
            prefix={<ArrowUpOutlined />}
          />
          <CameraSettingInput
            {...angleAzimuthInput}
            defaultValue={0}
            prefix={<ArrowLeftOutlined />}
          />
          <CameraSettingInput
            {...distanceInput}
            defaultValue={0}
            prefix={<ZoomInOutlined />}
          />
        </CameraSettingInputGroup>
      </CameraSettingGroup>

      <Button block onClick={handleResetCamera}>
        Reset camera
      </Button>
    </CameraSettingContainer>
  );
};

const CameraSettingContainer = styled.div``;

const CameraSettingGroup = styled.div`
  margin-bottom: 8px;
`;

const CameraSettingTitle = styled.div`
  margin-bottom: 8px;
`;

const CameraSettingInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 6px;
`;

const CameraSettingInput = styled(InputNumber)`
  width: 100%;
`;
export default CameraSetting;
