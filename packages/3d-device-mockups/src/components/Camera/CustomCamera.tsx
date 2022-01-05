import {
  extend,
  ReactThreeFiber,
  useFrame,
  useThree,
} from "@react-three/fiber";
import CameraControls from "camera-controls";
import React from "react";
import * as THREE from "three";

CameraControls.install({ THREE: THREE });

extend({ CameraControls });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cameraControls: ReactThreeFiber.Object3DNode<
        CameraControls,
        typeof CameraControls
      >;
    }
  }
}

export const CustomCamera: React.FC<any> = React.forwardRef(
  (props, ref: any) => {
    const { camera, gl } = useThree();
    useFrame((state, delta) => {
      if (ref.current) {
        ref.current.update(delta);
      }
    });

    return <cameraControls ref={ref} args={[camera, gl.domElement]} />;
  }
);
