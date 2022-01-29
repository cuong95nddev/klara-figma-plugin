import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Color,
  sRGBEncoding,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { ModelState } from ".";
import { Vector3 } from "../../types/Vector";
import {
  cleanMaterial,
  cleanRenderer,
  cleanScene,
} from "../../utilities/threeUtils";
import { MaterialItemState } from "../MaterialItem";

export declare interface ModelRenderRef {
  setMaterialTexture: (materialName: string, url: string) => void;
  getScene: () => any;
  getRenderer: () => WebGLRenderer;
  getPosition: () => Vector3;
  getRotation: () => Vector3;
  clean: () => void;
}
export declare interface ModelRenderProps {
  path: string;
  modelState: ModelState;
  materialsChanged?: (materialItems: MaterialItemState[]) => void;
  onLoaded?: () => void;
}

const ModelRenderInner = (
  { modelState, materialsChanged, onLoaded, path }: ModelRenderProps,
  ref: Ref<ModelRenderRef>
) => {
  const rotation: Vector3 = modelState.rotation;
  const { scene, materials } = useGLTF(path) as any;

  useEffect(() => {
    scene.rotation.set(rotation.x, rotation.y, rotation.z);
  }, [rotation]);

  useEffect(() => {
    return () => {
      cleanMaterial(materials);
      cleanScene(scene);
      cleanRenderer(gl);
    };
  }, []);

  useEffect(() => {
    if (!scene) {
      return;
    }

    if (onLoaded) {
      onLoaded();
    }
  }, [scene]);

  const { gl } = useThree();

  const [textureUrl, setTextureUrl] = useState<string>();
  const [selectedMaterialName, setSelectedMaterialName] = useState<string>();

  const textureLoader = useRef<TextureLoader>();

  const loadTexture = async (url: string): Promise<Texture> => {
    textureLoader.current = new TextureLoader();
    return await textureLoader.current.loadAsync(url);
  };

  const applyScreenTexture = async (textureUrl: string, material: any) => {
    let texture: Texture = await loadTexture(textureUrl);
    texture.encoding = sRGBEncoding;
    texture.flipY = false;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    gl.initTexture(texture);

    material.color = new Color(0xffffff);
    material.transparent = false;
    material.map = texture;
    material.needsUpdate = true;
  };

  const getSelectedMaterial = (): any => {
    return Object.values(materials).find(
      (material: any) => material.name === selectedMaterialName
    );
  };

  useEffect(() => {
    if (!textureUrl || !selectedMaterialName) {
      return;
    }

    let selectedMaterial = getSelectedMaterial();
    if (!selectedMaterial) {
      return;
    }

    applyScreenTexture(textureUrl, selectedMaterial);
  }, [textureUrl, selectedMaterialName]);

  useImperativeHandle(ref, () => ({
    setMaterialTexture(materialName: string, url: string) {
      setSelectedMaterialName(materialName);
      setTextureUrl(url);
    },
    getScene() {
      return scene;
    },
    getRenderer() {
      return gl;
    },
    getPosition() {
      return {
        x: scene.position.x,
        y: scene.position.y,
        z: scene.position.z,
      };
    },
    getRotation() {
      return {
        x: scene.rotation.x,
        y: scene.rotation.y,
        z: scene.rotation.z,
      };
    },
    clean() {
      setSelectedMaterialName(undefined);
      setTextureUrl(undefined);

      if (!path) {
        return;
      }
      useGLTF.clear(path);
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
          id: material.id,
          name: material.name,
          color: material.color.getHexString(),
          metalness: material.metalness,
          opacity: material.opacity,
          roughness: material.roughness,
        } as MaterialItemState)
    );

    materialsChanged?.(materialItems);
  };

  return <primitive object={scene} />;
};

const ModelRender = forwardRef(ModelRenderInner);

export default ModelRender;
