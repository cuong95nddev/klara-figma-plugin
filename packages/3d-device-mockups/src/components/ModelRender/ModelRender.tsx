import { useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import { MathUtils, sRGBEncoding } from "three";
import { ModelRenderState } from ".";
import { Vector3 } from "../../types/Vector";

export declare interface ModelRenderProps {
  selection: string;
  modelRenderState: ModelRenderState;
}

const ModelRender = ({ modelRenderState, selection }: ModelRenderProps) => {
  const empty: string =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

  const path: string = modelRenderState.path;
  const rotation: Vector3 = modelRenderState.rotation;

  const { scene } = useGLTF(path);
  const { gl } = useThree();
  const texture = useTexture(selection || empty);

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
