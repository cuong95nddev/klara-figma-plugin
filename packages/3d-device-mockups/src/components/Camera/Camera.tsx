import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import React, { Fragment, useEffect, useRef } from "react";
import { MathUtils, PerspectiveCamera } from "three";
import { CustomOrbitControls } from "./CameraControl";
import CameraState from "./CameraState";

export declare interface CameraProps {
  cameraState?: CameraState;
  onchange?: (cameraState: CameraState) => void;
}

const Camera = ({
  cameraState = {
    azimuthAngle: 0,
    polarAngle: 0,
    distance: 0,
  },
  onchange,
}: CameraProps) => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const orbitControls = useRef<CameraControls>(null!);

  const camera: PerspectiveCamera = useThree(
    ({ camera }) => camera
  ) as PerspectiveCamera;

  useEffect(() => {
    orbitControls.current.rotateTo(
      MathUtils.degToRad(cameraState.azimuthAngle),
      MathUtils.degToRad(cameraState.polarAngle),
      true
    );

    //orbitControls.current.zoomTo(cameraState.distance);
  }, [cameraState]);

  const handleUpdateEvent = () => {
    if (!onchange) {
      return;
    }

    onchange({
      azimuthAngle: Math.round(
        MathUtils.radToDeg(orbitControls.current.azimuthAngle)
      ),
      polarAngle: Math.round(
        MathUtils.radToDeg(orbitControls.current.polarAngle)
      ),
      distance: orbitControls.current.distance,
    });
  };

  useEffect(() => {
    camera.fov = 50;
    camera.near = 0.01;
    camera.far = 100;
    camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
    camera.updateProjectionMatrix();

    orbitControls.current.addEventListener("update", handleUpdateEvent);

    return () => {
      orbitControls.current.removeEventListener("update", handleUpdateEvent);
    };
  }, []);

  return (
    <Fragment>
      <CustomOrbitControls ref={orbitControls} />
    </Fragment>
  );
};

export default Camera;
