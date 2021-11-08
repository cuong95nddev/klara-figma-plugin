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
  const cameraRotationX = useFormInput(viewerState.camera.angle.azimuth);
  const cameraRotationY = useFormInput(viewerState.camera.angle.polar);

  useEffect(() => {
    updateCamera();
  }, [
    cameraRotationX.value,
    cameraRotationY.value,
  ]);

  const updateCamera = () => {
    dispatch(updateCameraState({
      angle: {
        azimuth: Number(cameraRotationX.value),
        polar: Number(cameraRotationY.value)
      },
      distance: 0
    }))
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
          <input {...modelRotationX} type="number" />
          <input {...modelRotationY} type="number" />
          <input {...modelRotationZ} type="number" />
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
          <input {...cameraRotationX} type="number" />
          <input {...cameraRotationY} type="number" />
        </div>
      </div>
    </div>
  );
};

export default ViewerSetting;
