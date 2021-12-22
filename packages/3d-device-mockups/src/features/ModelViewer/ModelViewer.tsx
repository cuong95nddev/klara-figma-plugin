import { on } from "@create-figma-plugin/utilities";
import { Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import styled from "styled-components";
import Camera, { CameraState } from "../../components/Camera";
import { CameraRef } from "../../components/Camera/Camera";
import { MaterialItemState } from "../../components/MaterialItem";
import ModelRender, { ModelRenderState } from "../../components/ModelRender";
import { ModelRenderRef } from "../../components/ModelRender/ModelRender";
import { SelectionChangedHandler } from "../../events";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { readAsDataURL } from "../../utilities/blobUtils";
import { MaterialSettingState } from "../MaterialSetting";
import {
  loadTextureForMaterialDone,
  updateMaterialStates,
} from "../MaterialSetting/MaterialSettingSlide";
import { updateCameraState, updateSelectedFrame } from "./ModelViewerSlide";
import ModelViewerState from "./ModelViewerState";

const ModelViewer = () => {
  const dispatch = useAppDispatch();

  const modelRenderRef = useRef<ModelRenderRef>(null);

  const modelViewerState: ModelViewerState = useAppSelector(
    (state) => state.modelViewerState
  );

  const modelRenderState: ModelRenderState = modelViewerState.modelRenderState;
  const cameraState: CameraState = modelViewerState.cameraState;
  const selectedFrame: string = modelViewerState.selectedFrame || "";

  useEffect(() => {
    on<SelectionChangedHandler>(
      "SELECTION_CHANGED",
      async (node: Uint8Array) => {
        const result: string = (await readAsDataURL(node)) as string;
        dispatch(updateSelectedFrame(result));
      }
    );
  }, []);

  const materialSettingState: MaterialSettingState = useAppSelector(
    (state) => state.materialSettingState
  );

  const loadTextureMaterialUUID = materialSettingState.loadTextureMaterialUUID;

  useEffect(() => {
    if (!loadTextureMaterialUUID) {
      return;
    }

    modelRenderRef.current?.setMaterialTexture(
      loadTextureMaterialUUID,
      selectedFrame
    );

    dispatch(loadTextureForMaterialDone());
  }, [loadTextureMaterialUUID]);

  const handleCameraChange = (cameraState: CameraState) => {
    console.log(cameraState);
    dispatch(updateCameraState(cameraState));
  };

  const handleMaterialsChanged = (materialItems: MaterialItemState[]): void => {
    dispatch(updateMaterialStates(materialItems));
  };

  const cameraRef = useRef<CameraRef>(null);

  const resetCamera = (): void => {
    cameraRef.current?.reset(modelRenderRef.current?.getScene());
  };

  const handleModelLoaded = (): void => {
    resetCamera();
  };

  return (
    <ModelViewerContainer>
      <Canvas>
        <ambientLight color="0xffffff" intensity={2} />
        <directionalLight
          color="0xffffff"
          intensity={2}
          position={[0.5, 0, 0.866]}
        />
        <directionalLight
          color="0xffffff"
          intensity={1.5}
          position={[-6, 2, 2]}
        />
        <Suspense fallback={null}>
          <ModelRender
            modelRenderState={{ ...modelRenderState }}
            materialsChanged={handleMaterialsChanged}
            onLoaded={handleModelLoaded}
            ref={modelRenderRef}
          />
          <Environment preset="city" />
        </Suspense>
        <Camera
          ref={cameraRef}
          cameraState={cameraState}
          onchange={handleCameraChange}
        />
      </Canvas>
      <Loader />
    </ModelViewerContainer>
  );
};

const ModelViewerContainer = styled.div`
  height: 100%;
  width: 100%;
  background: #eee
    url('data:image/svg+xml,\
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill-opacity=".15">\
      <rect x="200" width="200" height="200" />\
      <rect y="200" width="200" height="200" />\
    </svg>');
  background-size: 20px 20px;
`;

export default ModelViewer;
