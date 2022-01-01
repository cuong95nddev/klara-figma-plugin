import { emit, on } from "@create-figma-plugin/utilities";
import { Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Object3D, WebGLRenderer } from "three";
import { ModelSelection } from ".";
import Camera, { CameraState } from "../../components/Camera";
import { CameraRef } from "../../components/Camera/Camera";
import { MaterialItemState } from "../../components/MaterialItem";
import ModelRender, {
  findModelById,
  getDefaultModel,
  ModelState,
} from "../../components/ModelRender";
import { ModelRenderRef } from "../../components/ModelRender/ModelRender";
import {
  SelectionChanged,
  SelectionChangedHandler,
  StartPlugin,
  StartPluginHandler,
} from "../../events";
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
import { finishResetCameraAction } from "../CameraSetting/CameraSettingSlide";
import { ResetCameraAction } from "../CameraSetting/ResetCameraAction";
import { MaterialSettingState } from "../MaterialSetting";
import {
  loadTextureForMaterialDone,
  updateMaterialStates,
} from "../MaterialSetting/MaterialSettingSlide";
import {
  updateCameraState,
  updateModelPosition,
  updateModelRotation,
  updateModelSelection,
  updateModelViewerState,
  updateSelectedFrame,
} from "./ModelViewerSlide";
import ModelViewerState from "./ModelViewerState";

const ModelViewer = () => {
  const canvasRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const modelRenderRef = useRef<ModelRenderRef>(null);

  const modelViewerState: ModelViewerState = useAppSelector(
    (state) => state.modelViewerState
  );

  const modelState: ModelState = modelViewerState.modelState;
  const cameraState: CameraState = modelViewerState.cameraState;
  const selectedFrame: string = modelViewerState.selectedFrame || "";
  const resetCameraActionState: ResetCameraAction = useAppSelector(
    (state) => state.cameraSettingState.resetCameraAction
  );

  const modelSelection: ModelSelection = useAppSelector(
    (state) => state.modelViewerState.modelSelection
  );

  const [path, setPath] = useState<string>();

  useEffect(() => {
    if (!modelSelection) {
      return;
    }

    if (modelSelection.isDefault && modelSelection.id) {
      const model = findModelById(modelSelection.id);
      if (!model) {
        return;
      }

      setPath(model.path);
    }
  }, [modelSelection]);

  useEffect(() => {
    on<StartPluginHandler>("START_PLUGIN", async (startPlugin: StartPlugin) => {
      if (!startPlugin) {
        return;
      }

      if (startPlugin.viewerState) {
        const viewerState = startPlugin.viewerState;
        dispatch(updateModelViewerState({ ...viewerState }));
        return;
      }

      // update select frame
      if (startPlugin.nodeBlob) {
        await handleSelectedNode(startPlugin.nodeBlob);
      }

      // load default model
      const defaultModel = getDefaultModel();
      dispatch(
        updateModelSelection({
          isDefault: true,
          id: defaultModel.id,
        })
      );
    });

    on<SelectionChangedHandler>(
      "SELECTION_CHANGED",
      async (selectionChanged: SelectionChanged) => {
        await handleSelectedNode(selectionChanged.nodeBlob);
      }
    );
  }, []);

  const handleSelectedNode = async (nodeBlob: Uint8Array): Promise<void> => {
    const result: string = (await readAsDataURL(nodeBlob)) as string;
    dispatch(updateSelectedFrame(result));
  };

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

  useEffect(() => {
    if (resetCameraActionState != ResetCameraAction.START) {
      return;
    }
    resetCamera();
    dispatch(finishResetCameraAction());
  }, [resetCameraActionState]);

  const resetCamera = (): void => {
    cameraRef.current?.reset(modelRenderRef.current?.getScene());
  };

  const handleModelLoaded = (): void => {
    //resetCamera();

    let modelPosition = modelRenderRef.current?.getPosition();
    if (modelPosition) {
      dispatch(updateModelPosition(modelPosition));
    }

    let modelRotation = modelRenderRef.current?.getRotation();
    if (modelRotation) {
      dispatch(updateModelRotation(modelRotation));
    }
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
      viewerState: { ...modelViewerState },
      image: {
        width: imageElement.width,
        height: imageElement.height,
        bytes: blob,
        x: 0,
        y: 0,
      },
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
    <>
      {path && (
        <ModelViewerContainer>
          <Canvas ref={canvasRef}>
            <Suspense fallback={null}>
              <ModelRender
                path={path}
                modelState={{ ...modelState }}
                materialsChanged={handleMaterialsChanged}
                onLoaded={handleModelLoaded}
                ref={modelRenderRef}
              />
              <Environment preset="city" />
            </Suspense>
            <Camera
              ref={cameraRef}
              cameraState={{ ...cameraState }}
              onCameraChange={handleCameraChange}
            />
          </Canvas>
          <Loader />
        </ModelViewerContainer>
      )}
    </>
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
