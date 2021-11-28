import { useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { MathUtils, sRGBEncoding } from "three";
import { ModelRenderState } from ".";
import { Vector3 } from "../../types/Vector";
import { MaterialItemState } from "../MaterialItem";

export declare interface ModelRenderProps {
  selectedFrame: string;
  selectedMaterialUUID: string;
  modelRenderState: ModelRenderState;
  materialsChanged?: (materialItems: MaterialItemState[]) => void;
}

const ModelRender = ({
  modelRenderState,
  selectedFrame,
  selectedMaterialUUID,
  materialsChanged,
}: ModelRenderProps) => {
  const empty: string =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

  const path: string = modelRenderState.path;
  const rotation: Vector3 = modelRenderState.rotation;

  const { scene, nodes, materials } = useGLTF(path) as any;
  const { gl } = useThree();
  const texture = useTexture(selectedFrame || empty);

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

    console.log(materials);

    // scene.traverse((object3D: any) => {
    //   if (object3D.name === "Screen") {
    //     object3D.material.map = texture;
    //     object3D.material.needsUpdate = true;
    //   }
    // });
  }, [texture, gl, scene]);

  useEffect(() => {
    extractMaterial();
  }, [materials]);

  const extractMaterial = () => {
    if (!materials) {
      return;
    }
    let materialItems: MaterialItemState[] = Object.values(materials).map(
      (material: any) =>
        ({
          uuid: material.uuid,
          name: material.name,
          color: material.color.getHexString(),
          metalness: material.metalness,
          opacity: material.opacity,
          roughness: material.roughness,
        } as MaterialItemState)
    );

    materialsChanged?.(materialItems);
  };

  useEffect(() => {
    let selectedMaterial: any = Object.values(materials).find(
      (material: any) => material.uuid === selectedMaterialUUID
    );
    if (!selectedMaterial) {
      return;
    }

    selectedMaterial.map = texture;
    selectedMaterial.needsUpdate = true;
  }, [selectedMaterialUUID]);

  return <primitive object={scene} />;
};

export default ModelRender;
