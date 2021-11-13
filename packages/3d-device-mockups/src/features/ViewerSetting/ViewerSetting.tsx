import { InputNumber } from "antd";
import * as React from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useFormInput } from "../../hooks";
import { updateCameraState } from "../Viewer/ViewerSlide";

const ViewerSetting = () => {
  const viewerState = useAppSelector((state) => state.viewerState);
  const dispatch = useAppDispatch();

  const modelRotationX = useFormInput(viewerState.model.rotation.x);
  const modelRotationY = useFormInput(viewerState.model.rotation.y);
  const modelRotationZ = useFormInput(viewerState.model.rotation.z);
  const cameraAzimuthAngle = useFormInput(viewerState.camera.angle.azimuth);
  const cameraPolarAngle = useFormInput(viewerState.camera.angle.polar);
  const cameraDistance = useFormInput(viewerState.camera.distance);

  useEffect(() => {
    updateCamera();
  }, [cameraAzimuthAngle.value, cameraPolarAngle.value, cameraDistance.value]);

  const updateCamera = () => {
    dispatch(
      updateCameraState({
        angle: {
          azimuth: Number(cameraAzimuthAngle.value),
          polar: Number(cameraPolarAngle.value),
        },
        distance: Number(cameraDistance.value),
      })
    );
  };

  return (
    <div>
      <div>
        <div>Device rotation</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: "6px",
          }}
        >
          <InputNumber {...modelRotationY} />
          <InputNumber {...modelRotationY} />
          <InputNumber {...modelRotationZ} />
        </div>
      </div>

      <div>
        <div>Camera rotation</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: "6px",
          }}
        >
          <InputNumber {...cameraAzimuthAngle} />
          <InputNumber {...cameraPolarAngle} />
          <InputNumber {...cameraDistance} />
        </div>
      </div>
    </div>
  );
};

export default ViewerSetting;
