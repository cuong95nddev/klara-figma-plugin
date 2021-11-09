import { useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import { Color, MathUtils, sRGBEncoding } from "three";
import { ModelRenderState } from ".";
import defaultModel from "./DefaultModel";

export declare interface ModelRenderProps {
  modelRenderState: ModelRenderState;
  selection: string;
}

const ModelRender = ({ modelRenderState, selection }: ModelRenderProps) => {
  const empty: string = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
  const devicePath: string = defaultModel[0].path || "";
  const { scene } = useGLTF(devicePath);
  const { gl } = useThree();
  const texture = useTexture(selection || empty);

  const rotation = useMemo(() => modelRenderState.rotation, [modelRenderState]);

  useEffect(() => {
    scene.rotation.set(
      MathUtils.degToRad(rotation.x),
      MathUtils.degToRad(rotation.y),
      MathUtils.degToRad(rotation.z)
    );
  }, [rotation]);

  useEffect(() => {
    texture.encoding = sRGBEncoding;
    texture.flipY = true;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();

    gl.initTexture(texture);

    scene.traverse((object3D) => {
      const node: any = object3D as any;
      if (node.name === "Screen") {
        node.material.map = texture;
        node.material.needsUpdate = true;
      }
    });
  }, [texture, gl, scene]);

  return <primitive object={scene} />;
};

export default ModelRender;
