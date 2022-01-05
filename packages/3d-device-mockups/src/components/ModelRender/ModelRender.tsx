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
  AmbientLight,
  Color,
  Light,
  LinearFilter,
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
  removeLights,
} from "../../utilities/threeUtils";
import { MaterialItemState } from "../MaterialItem";

export declare interface ModelRenderRef {
  setMaterialTexture: (materialId: number, url: string) => void;
  getScene: () => any;
  getRenderer: () => WebGLRenderer;
  getPosition: () => Vector3;
  getRotation: () => Vector3;
  clear: () => void;
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
  const { scene, nodes, materials } = useGLTF(path) as any;
  const lights = useRef<Light[]>([]);
  const [updateScene, setUpdateScene] = useState<number>(0);

  useEffect(() => {
    console.log("model rotation updated");
    scene.rotation.set(rotation.x, rotation.y, rotation.z);
  }, [rotation]);

  useEffect(() => {
    return () => {
      cleanMaterial(materials);
      removeLights(lights.current);
      cleanScene(scene);
      cleanRenderer(gl);
    };
  }, []);

  useEffect(() => {
    if (!scene) {
      return;
    }

    lights.current = [];

    const ambientLight = new AmbientLight(0xffffff, 2);
    lights.current.push(ambientLight);

    // const directionalLight = new DirectionalLight(0xffffff, 1.5);
    // directionalLight.position.set(-6, 2, 2);
    // lights.current.push(directionalLight);

    for (const light of lights.current) {
      scene.add(light);
    }

    setUpdateScene(Date.now());

    if (onLoaded) {
      onLoaded();
    }
  }, [scene]);

  const { gl } = useThree();

  const [textureUrl, setTextureUrl] = useState<string>();
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>();

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
      (material: any) => material.id === selectedMaterialId
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
  }, [textureUrl, selectedMaterialId]);

  useImperativeHandle(ref, () => ({
    setMaterialTexture(materialId: number, url: string) {
      setSelectedMaterialId(materialId);
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
    clear(){
      if(!path){
        return;
      }

      console.log("model cleared");

      useGLTF.clear(path);
    }
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

    console.log(materialItems)

    materialsChanged?.(materialItems);
  };

  return <primitive object={scene} />;
};

const ModelRender = forwardRef(ModelRenderInner);

export default ModelRender;
