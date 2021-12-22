import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Color,
  LinearFilter,
  sRGBEncoding,
  Texture,
  TextureLoader,
} from "three";
import { ModelRenderState } from ".";
import { Vector3 } from "../../types/Vector";
import { MaterialItemState } from "../MaterialItem";

export declare interface ModelRenderRef {
  setMaterialTexture: (materialUUID: string, url: string) => void;
  getScene: () => any;
}
export declare interface ModelRenderProps {
  modelRenderState: ModelRenderState;
  materialsChanged?: (materialItems: MaterialItemState[]) => void;
  onLoaded?: () => void;
}

const ModelRenderInner = (
  { modelRenderState, materialsChanged, onLoaded }: ModelRenderProps,
  ref: Ref<ModelRenderRef>
) => {
  const path: string = modelRenderState.path;
  const rotation: Vector3 = modelRenderState.rotation;

  const { scene, nodes, materials } = useGLTF(path) as any;

  const sceneClone = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (!sceneClone) {
      return;
    }

    if (!onLoaded) {
      return;
    }

    onLoaded();
  }, [sceneClone]);

  const { gl } = useThree();

  const [textureUrl, setTextureUrl] = useState<string>();
  const [selectedMaterialUUID, setSelectedMaterialUUID] = useState<string>();

  const textureLoader = useRef<TextureLoader>();

  const loadTexture = async (url: string): Promise<Texture> => {
    textureLoader.current = new TextureLoader();
    return await textureLoader.current.loadAsync(url);
  };

  const applyScreenTexture = async (textureUrl: string, material: any) => {
    let texture: Texture = await loadTexture(textureUrl);

    texture.encoding = sRGBEncoding;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.flipY = false;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.generateMipmaps = false;

    await gl.initTexture(texture);

    material.color = new Color(0xffffff);
    material.transparent = false;
    material.map = texture;
    material.needsUpdate = true;
  };

  const getSelectedMaterial = (): any =>
    Object.values(materials).find(
      (material: any) => material.uuid === selectedMaterialUUID
    );

  useEffect(() => {
    if (!textureUrl) {
      return;
    }

    let selectedMaterial = getSelectedMaterial();
    if (!selectedMaterial) {
      return;
    }

    applyScreenTexture(textureUrl, selectedMaterial);
  }, [textureUrl, selectedMaterialUUID]);

  useImperativeHandle(ref, () => ({
    setMaterialTexture(materialUUID: string, url: string) {
      setSelectedMaterialUUID(materialUUID);
      setTextureUrl(url);
    },
    getScene() {
      return scene;
    },
  }));

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

  return <primitive object={sceneClone} />;
};

const ModelRender = forwardRef(ModelRenderInner);

export default ModelRender;
