import { on } from "@create-figma-plugin/utilities";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Camera, { CameraState } from "../../components/Camera";
import { MaterialItemState } from "../../components/MaterialItem";
import ModelRender, { ModelRenderState } from "../../components/ModelRender";
import { SelectionChangedHandler } from "../../events";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { readAsDataURL } from "../../utilities/blobUtils";
import { updateMaterialStates } from "../MaterialSetting/MaterialSettingSlide";
import { updateCameraState, updateSelectedFrame } from "./ModelViewerSlide";

const ModelViewer = () => {
  const [selection, setSelection] = useState<string>("");

  const modelViewerState = useAppSelector((state) => state.modelViewerState);
  const modelRenderState: ModelRenderState = useMemo<ModelRenderState>(
    () => modelViewerState.modelRenderState,
    [modelViewerState]
  );
  const cameraState: CameraState = useMemo<CameraState>(
    () => modelViewerState.cameraState,
    [modelViewerState]
  );

  const selectedFrame = modelViewerState.selectedFrame || "";

  const dispatch = useAppDispatch();
  useEffect(() => {
    on<SelectionChangedHandler>(
      "SELECTION_CHANGED",
      async (node: Uint8Array) => {
        const result: string = (await readAsDataURL(node)) as string;
        dispatch(updateSelectedFrame(result));
      }
    );
  }, []);

  const selectedMaterialUUID =
    useAppSelector(
      (state) => state.materialSettingState.selectedMaterialUUID
    ) || "";

  const handleCameraChange = (cameraState: CameraState) => {
    dispatch(updateCameraState(cameraState));
  };

  const handleMaterialsChanged = (materialItems: MaterialItemState[]): void => {
    dispatch(updateMaterialStates(materialItems));
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
            selectedFrame={selectedFrame}
            materialsChanged={handleMaterialsChanged}
            selectedMaterialUUID={selectedMaterialUUID}
          />
        </Suspense>
        <Camera cameraState={cameraState} onchange={handleCameraChange} />
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
