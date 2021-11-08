import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, PerspectiveCamera } from "three";
import { CustomOrbitControls } from "./CameraControl";
import CameraState from "./CameraState";

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

    //orbitControls.current.zoomTo(cameraState.distance);
  }, [cameraState]);

  const handleUpdateEvent = () => {
    dirty.current = true;

    if (!onchange) {
      return;
    }

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

    cameraControlRef.current.addEventListener("control", handleUpdateEvent);

    return () => {
      cameraControlRef.current.removeEventListener(
        "control",
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
