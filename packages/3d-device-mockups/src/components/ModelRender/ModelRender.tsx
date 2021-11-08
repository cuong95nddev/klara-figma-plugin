import { useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import { MathUtils } from "three";
import { ModelRenderState } from ".";
import defaultModel from "./DefaultModel";

export declare interface ModelRenderProps {
  modelRenderState: ModelRenderState;
}

const ModelRender = ({ modelRenderState }: ModelRenderProps) => {
  const devicePath: string = defaultModel[0].path || "";
  const { scene } = useGLTF(devicePath);

  const rotation = useMemo(() => modelRenderState.rotation, [modelRenderState]);

  useEffect(() => {
    scene.rotation.set(
      MathUtils.degToRad(rotation.x),
      MathUtils.degToRad(rotation.y),
      MathUtils.degToRad(rotation.z)
    );
  }, [rotation]);

  return <primitive object={scene} />;
};

export default ModelRender;
