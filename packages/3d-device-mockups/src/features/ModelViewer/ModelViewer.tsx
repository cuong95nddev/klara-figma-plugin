import { emit, on } from "@create-figma-plugin/utilities";
import { Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef } from "react";
import styled from "styled-components";
import { Object3D, WebGLRenderer } from "three";
import Camera, { CameraState } from "../../components/Camera";
import { CameraRef } from "../../components/Camera/Camera";
import { MaterialItemState } from "../../components/MaterialItem";
import ModelRender, { ModelRenderState } from "../../components/ModelRender";
import { ModelRenderRef } from "../../components/ModelRender/ModelRender";
import { SelectionChangedHandler } from "../../events";
import { ExportImageHandler } from "../../events/ExportImageHandler";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getImage,
  getImageBlob,
  readAsDataURL,
} from "../../utilities/imageUtils";
import { ActionState } from "../Action";
import { updateExportImageState } from "../Action/ActionSlide";
import { ExportImageState } from "../Action/ExportImageState";
import { MaterialSettingState } from "../MaterialSetting";
import {
  loadTextureForMaterialDone,
  updateMaterialStates,
} from "../MaterialSetting/MaterialSettingSlide";
import { updateCameraState, updateSelectedFrame } from "./ModelViewerSlide";
import ModelViewerState from "./ModelViewerState";

const ModelViewer = () => {
  const canvasRef = useRef<any>(null);
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

  const exportImage = async (): Promise<any> => {
    if (!modelRenderRef.current) {
      return;
    }

    const renderer: WebGLRenderer = modelRenderRef.current?.getRenderer();
    const scene: Object3D<Event> = modelRenderRef.current?.getScene();
    const camera: THREE.Camera = cameraRef.current?.getCamera();
    renderer.setPixelRatio(2);
    renderer.render(scene, camera);

    const image: string = renderer.domElement.toDataURL("image/png", 1);
    let imageElement: HTMLImageElement = await getImage(image);
    const blob = getImageBlob(image);

    emit<ExportImageHandler>("EXPORT_IMAGE", {
      width: imageElement.width,
      height: imageElement.height,
      bytes: blob,
      x: 0,
      y: 0,
    });
  };

  const actionState: ActionState = useAppSelector((state) => state.actionState);

  const exportImageState = actionState.exportImage;

  useEffect(() => {
    if (exportImageState != ExportImageState.START) {
      return;
    }
    exportImage();
    dispatch(updateExportImageState(ExportImageState.FINISHED));
  }, [exportImageState]);

  return (
    <ModelViewerContainer>
      <Canvas ref={canvasRef}>
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
