import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Fragment, Suspense, useMemo } from "react";
import Camera from "../../components/Camera/Camera";
import CameraState from "../../components/Camera/CameraState";
import ModelRender from "../../components/ModelRender";
import ModelRenderState from "../../components/ModelRender/ModelRenderState";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateCameraState } from "./ViewerSlide";

const Viewer = () => {
  const viewerState = useAppSelector((state) => state.viewerState);
  //const viewerSetting = useAppSelector((state) => state.viewerSetting);
  const dispatch = useAppDispatch();

  // const cameraState: CameraState = useMemo(() => {
  //   return {
  //     azimuthAngle: viewerSetting.camera.azimuthAngle,
  //     polarAngle: viewerSetting.camera.polarAngle,
  //     distance: viewerState.camera.distance,
  //   };
  // }, [viewerSetting]);

  // const modelRenderState: ModelRenderState = useMemo(() => {
  //   return viewerState.model;
  // }, [viewerSetting]);

  const handleCameraChange = (cameraState: CameraState) => {
    dispatch(updateCameraState(cameraState));
  };

  return (
    <Fragment>
      <Canvas>
        <ambientLight color={16777215} intensity={2} />
        <directionalLight
          color={16777215}
          intensity={2}
          position={[0.5, 0, 0.866]}
        />
        <directionalLight
          color={16777215}
          intensity={1.5}
          position={[-6, 2, 2]}
        />
        <Suspense fallback={null}>
          <ModelRender
            modelRenderState={{
              rotation: {
                x: 0,
                y: 0,
                z: 0,
              },
              position: {
                x: 0,
                y: 0,
                z: 0,
              },
            }}
          />
        </Suspense>

        <Camera
          cameraState={{
            azimuthAngle: 0,
            polarAngle: 0,
            distance: 0,
          }}
          onchange={handleCameraChange}
        />
      </Canvas>
      <Loader />
    </Fragment>
  );
};

export default Viewer;
