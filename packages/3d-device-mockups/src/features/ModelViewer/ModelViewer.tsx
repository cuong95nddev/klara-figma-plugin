import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Fragment, Suspense, useMemo } from "react";
import Camera, { CameraState } from "../../components/Camera";
import ModelRender from "../../components/ModelRender";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateCameraState } from "../Viewer/ViewerSlide";

const ModelViewer = () => {
  const viewerState = useAppSelector((state) => state.viewerState);
  const dispatch = useAppDispatch();

  const cameraState: CameraState = useMemo(() => {
    return {
      ...viewerState.camera,
    };
  }, [viewerState]);
  
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
        <Camera cameraState={cameraState} onchange={handleCameraChange} />
      </Canvas>
      <Loader />
    </Fragment>
  );
};

export default ModelViewer;
