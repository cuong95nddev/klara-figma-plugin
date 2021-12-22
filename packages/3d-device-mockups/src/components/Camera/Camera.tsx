import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Box3,
  MathUtils,
  Object3D,
  PerspectiveCamera,
  Sphere,
  Vector2,
  Vector3,
} from "three";
import { CustomOrbitControls } from "./CameraControl";
import CameraState from "./CameraState";
import useCameraKeyboard from "./useCameraKeyboard";

export declare interface CameraRef {
  reset: (box3OrObject: Object3D<Event> | Box3) => void;
}

export declare interface CameraProps {
  cameraState?: CameraState;
  onchange?: (cameraState: CameraState) => void;
}

const CameraInner: ForwardRefRenderFunction<CameraRef, CameraProps> = (
  {
    cameraState = {
      angle: {
        azimuth: 0,
        polar: 0,
      },
      distance: 0,
    },
    onchange,
  }: CameraProps,
  ref: Ref<CameraRef>
) => {
  const gl = useThree((state) => state.gl);
  const cameraControlRef = useRef<CameraControls>(null!);
  useCameraKeyboard(cameraControlRef);

  const dirty = useRef(false);

  // useEffect(() => {
  //   if (dirty.current) {
  //     dirty.current = false;
  //     return;
  //   }

  //   // cameraControlRef.current.rotateTo(
  //   //   MathUtils.degToRad(cameraState.angle.azimuth),
  //   //   MathUtils.degToRad(cameraState.angle.polar),
  //   //   true
  //   // );

  //   // cameraControlRef.current.dollyTo(cameraState.distance, true);

  //   //cameraControlRef.current.reset();
  // }, [cameraState]);

  // const handleUpdateEvent = () => {
  //   dirty.current = true;

  //   if (!onchange) {
  //     return;
  //   }

  //   onchange({
  //     angle: {
  //       azimuth: Math.round(
  //         MathUtils.radToDeg(cameraControlRef.current.azimuthAngle)
  //       ),
  //       polar: Math.round(
  //         MathUtils.radToDeg(cameraControlRef.current.polarAngle)
  //       ),
  //     },
  //     distance: cameraControlRef.current.distance,
  //   });
  // };

  useEffect(() => {
    let camera = cameraControlRef.current.camera as PerspectiveCamera;
    camera.fov = 50;
    camera.near = 0.01;
    camera.far = 100;
    camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
    camera.updateProjectionMatrix();

    // cameraControlRef.current.addEventListener("controlend", handleUpdateEvent);
    // return () => {
    //   cameraControlRef.current.removeEventListener(
    //     "controlend",
    //     handleUpdateEvent
    //   );
    // };
  }, []);

  useImperativeHandle(ref, () => ({
    reset(box3OrObject: Object3D<Event> | Box3) {
      cameraControlRef.current.reset();
      paddingInCssPixel(box3OrObject, 30, 30, 30, 30);
    },
  }));

  const paddingInCssPixel = (
    mesh: any,
    top: number,
    right: number,
    bottom: number,
    left: number
  ): void => {
    let perspectiveCamera = cameraControlRef.current
      .camera as PerspectiveCamera;

    const fov = perspectiveCamera.fov * MathUtils.DEG2RAD;
    const rendererHeight = gl.getSize(new Vector2()).height;

    const boundingBox = new Box3().setFromObject(mesh);
    const size = boundingBox.getSize(new Vector3());
    const boundingWidth = size.x;
    const boundingHeight = size.y;
    const boundingDepth = size.z;

    var distanceToFit = cameraControlRef.current.getDistanceToFitBox(
      boundingWidth,
      boundingHeight,
      boundingDepth
    );
    var paddingTop = 0;
    var paddingBottom = 0;
    var paddingLeft = 0;
    var paddingRight = 0;

    // loop to find almost convergence points
    for (var i = 0; i < 10; i++) {
      const depthAt = distanceToFit - boundingDepth * 0.5;
      const cssPixelToUnit =
        (2 * Math.tan(fov * 0.5) * Math.abs(depthAt)) / rendererHeight;
      paddingTop = top * cssPixelToUnit;
      paddingBottom = bottom * cssPixelToUnit;
      paddingLeft = left * cssPixelToUnit;
      paddingRight = right * cssPixelToUnit;

      distanceToFit = cameraControlRef.current.getDistanceToFitBox(
        boundingWidth + paddingLeft + paddingRight,
        boundingHeight + paddingTop + paddingBottom,
        boundingDepth
      );
    }

    cameraControlRef.current.fitToBox(mesh, false, {
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      paddingBottom: paddingBottom,
      paddingTop: paddingTop,
    });
  };

  return (
    <Fragment>
      <CustomOrbitControls ref={cameraControlRef} />
    </Fragment>
  );
};

const Camera = forwardRef(CameraInner);

export default Camera;
