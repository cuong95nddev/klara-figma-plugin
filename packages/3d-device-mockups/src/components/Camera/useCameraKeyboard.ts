import CameraControls from "camera-controls";
import { MutableRefObject, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { MathUtils } from "three";

function useCameraKeyboard(camera: MutableRefObject<CameraControls>) {
  const step = 4;
  useHotkeys("a,left", (_) => {
    camera.current.rotate(-step * MathUtils.DEG2RAD, 0, true);
  });

  useHotkeys("d,right", (_) => {
    camera.current.rotate(step * MathUtils.DEG2RAD, 0, true);
  });

  useHotkeys("w,up", (_) => {
    camera.current.rotate(0, -step * MathUtils.DEG2RAD, true);
  });

  useHotkeys("s,down", (_) => {
    camera.current.rotate(0, step * MathUtils.DEG2RAD, true);
  });
}

export default useCameraKeyboard;
