import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, PerspectiveCamera } from "three";
import { CustomOrbitControls } from "./CameraControl";
import CameraState from "./CameraState";
import useCameraKeyboard from "./useCameraKeyboard";

export declare interface CameraProps {
  cameraState?: CameraState;
  onchange?: (cameraState: CameraState) => void;
}

const Camera = ({
  cameraState = {
    angle: {
      azimuth: 0,
      polar: 0,
    },
    distance: 0,
  },
  onchange,
}: CameraProps) => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const cameraControlRef = useRef<CameraControls>(null!);
  useCameraKeyboard(cameraControlRef);
  const camera: PerspectiveCamera = useThree(
    ({ camera }) => camera
  ) as PerspectiveCamera;
  const dirty = useRef(false);

  useEffect(() => {
    if(dirty.current){
      dirty.current = false;
      return;
    }

    cameraControlRef.current.rotateTo(
      MathUtils.degToRad(cameraState.angle.azimuth),
      MathUtils.degToRad(cameraState.angle.polar),
      true
    );

    cameraControlRef.current.dollyTo(cameraState.distance, true);
  }, [cameraState]);

  const handleUpdateEvent = () => {
    dirty.current = true;

    if (!onchange) {
      return;
    }

    console.log(cameraControlRef.current.distance);

    let cameraState: CameraState = {
      angle: {
        azimuth: Math.round(
          MathUtils.radToDeg(cameraControlRef.current.azimuthAngle)
        ),
        polar: Math.round(
          MathUtils.radToDeg(cameraControlRef.current.polarAngle)
        ),
      },
      distance: cameraControlRef.current.distance,
    };
    onchange({...cameraState});
  };

  useEffect(() => {
    camera.fov = 50;
    camera.near = 0.01;
    camera.far = 100;
    camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
    camera.updateProjectionMatrix();

    const KEYCODE = {
      W: 87,
      A: 65,
      S: 83,
      D: 68,
      ARROW_LEFT : 37,
      ARROW_UP   : 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN : 40,
    };
    
    cameraControlRef.current.addEventListener("update", handleUpdateEvent);
    return () => {
      cameraControlRef.current.removeEventListener(
        "update",
        handleUpdateEvent
      );
    };
  }, []);

  return (
    <Fragment>
      <CustomOrbitControls ref={cameraControlRef} />
    </Fragment>
  );
};

export default Camera;
