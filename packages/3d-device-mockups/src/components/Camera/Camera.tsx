import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import _ from "lodash";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Box3,
  MathUtils,
  Object3D,
  PerspectiveCamera,
  Vector2,
  Vector3,
} from "three";
import CameraState from "./CameraState";
import { CustomCamera } from "./CustomCamera";
import useCameraKeyboard from "./useCameraKeyboard";

export declare interface CameraRef {
  reset: (box3OrObject: Object3D<Event> | Box3) => void;
  getCamera: () => any;
}

export declare interface CameraProps {
  cameraState?: CameraState;
  onCameraChange?: (cameraState: CameraState) => void;
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
    onCameraChange,
  }: CameraProps,
  ref: Ref<CameraRef>
) => {
  const gl = useThree((state) => state.gl);
  const cameraControlRef = useRef<CameraControls>(null!);
  useCameraKeyboard(cameraControlRef);

  const cameraShouldUpdate = useRef(true);

  useEffect(() => {
    if (!cameraShouldUpdate.current) {
      cameraShouldUpdate.current = true;
      return;
    }

    cameraControlRef.current.rotateTo(
      MathUtils.degToRad(cameraState.angle.azimuth),
      MathUtils.degToRad(cameraState.angle.polar),
      false
    );

    cameraControlRef.current.dollyTo(cameraState.distance, false);
  }, [cameraState]);

  const handleUpdateCameraState = () => {
    cameraShouldUpdate.current = false;

    if (!onCameraChange) {
      return;
    }

    onCameraChange({
      angle: {
        azimuth: Math.round(
          MathUtils.radToDeg(cameraControlRef.current.azimuthAngle)
        ),
        polar: Math.round(
          MathUtils.radToDeg(cameraControlRef.current.polarAngle)
        ),
      },
      distance: cameraControlRef.current.distance,
    });
  };

  const debounceHandleUpdateCameraState = useCallback(
    _.debounce(handleUpdateCameraState, 350),
    []
  );

  useEffect(() => {
    let camera = cameraControlRef.current.camera as PerspectiveCamera;
    camera.fov = 50;
    camera.near = 0.01;
    camera.far = 100;
    camera.aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
    camera.updateProjectionMatrix();

    cameraControlRef.current.addEventListener(
      "control",
      debounceHandleUpdateCameraState
    );

    return () => {
      cameraControlRef.current.removeEventListener(
        "control",
        debounceHandleUpdateCameraState
      );
    };
  }, []);

  useImperativeHandle(ref, () => ({
    reset(box3OrObject: Object3D<Event> | Box3) {
      paddingInCssPixel(box3OrObject, 30, 30, 30, 30);
      handleUpdateCameraState();
    },
    getCamera() {
      return cameraControlRef.current.camera;
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
      <CustomCamera ref={cameraControlRef} />
    </Fragment>
  );
};

const Camera = forwardRef(CameraInner);

export default Camera;
