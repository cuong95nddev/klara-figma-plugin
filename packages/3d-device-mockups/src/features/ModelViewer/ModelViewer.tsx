import { emit, on } from "@create-figma-plugin/utilities";
import { Environment, Loader } from "@react-three/drei";
import { Canvas, RootState } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { NoToneMapping, Scene, WebGLRenderer } from "three";
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
  NodeSelected,
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
import { ExportState } from "../Export";
import { updateExportImageState } from "../Export/ExportSlide";
import { ExportImageState } from "../Export/ExportImageState";
import {
  finishResetCamera,
  resettingCamera,
  triggerResetCamera,
} from "../CameraSetting/CameraSettingSlide";
import { ResetCameraTrigger } from "../CameraSetting/ResetCameraTrigger";
import { EnvironmentState } from "../EnvironmentSetting";
import { EnvironmentPreset } from "../EnvironmentSetting/EnvironmentPreset";
import { MaterialSettingState } from "../MaterialSetting";
import {
  loadTextureForMaterialDone,
  updateMaterialStates,
} from "../MaterialSetting/MaterialSettingSlide";
import {
  addMaterialTexture,
  setEnvironmentPreset,
  setLightIntensity,
  updateCameraState,
  updateModelPosition,
  updateModelRotation,
  updateModelSelection,
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
  const [selectedNode, setSelectedNode] = useState<NodeSelected | undefined>();
  const [selectedNodes, setSelectedNodes] = useState<NodeSelected[]>([]);

  const resetCameraTrigger: ResetCameraTrigger = useAppSelector(
    (state) => state.cameraSettingState.resetCameraTrigger
  );

  const modelSelection: ModelSelection | undefined = useAppSelector(
    (state) => state.modelViewerState.modelSelection
  );

  const [path, setPath] = useState<string>();

  const [viewerStateFromPlugin, setViewerStateFromPlugin] =
    useState<ModelViewerState>();

  useEffect(() => {
    if (!modelSelection) {
      return;
    }

    modelRenderRef.current?.clean();

    if (modelSelection.isDefault && modelSelection.id) {
      const model = findModelById(modelSelection.id);
      if (!model) {
        return;
      }

      setPath(model.path);
    }
  }, [modelSelection?.id]);

  const [isModelFromPluginDataLoaded, setIsModelFromPluginDataLoaded] =
    useState<boolean>(false);

  useEffect(() => {
    on<StartPluginHandler>("START_PLUGIN", async (startPlugin: StartPlugin) => {
      if (!startPlugin) {
        return;
      }

      if (startPlugin.viewerState) {
        const viewerState = startPlugin.viewerState;

        dispatch(updateModelSelection({ ...viewerState.modelSelection! }));

        if (startPlugin.selectedNodes) {
          for (const node of startPlugin.selectedNodes) {
            node.nodeDataUrl = (await readAsDataURL(node.nodeBlob)) as string;
          }

          setSelectedNodes(startPlugin.selectedNodes);
        }

        setViewerStateFromPlugin({ ...viewerState });
        return;
      }

      // update select frame
      if (startPlugin.selectedNode) {
        startPlugin.selectedNode.nodeDataUrl = (await readAsDataURL(
          startPlugin.selectedNode.nodeBlob
        )) as string;
        setSelectedNode(startPlugin.selectedNode);
      }

      // load default model
      const defaultModel = getDefaultModel();
      dispatch(
        updateModelSelection({
          isDefault: true,
          id: defaultModel.id,
        })
      );

      setIsModelFromPluginDataLoaded(true);
    });

    on<SelectionChangedHandler>(
      "SELECTION_CHANGED",
      async (selectionChanged: SelectionChanged) => {
        selectionChanged.selectedNode.nodeDataUrl = (await readAsDataURL(
          selectionChanged.selectedNode.nodeBlob
        )) as string;
        setSelectedNode(selectionChanged.selectedNode);
      }
    );
  }, []);

  const materialSettingState: MaterialSettingState = useAppSelector(
    (state) => state.materialSettingState
  );

  const loadTextureMaterialName = materialSettingState.loadTextureMaterialName;

  useEffect(() => {
    if (
      !loadTextureMaterialName ||
      !selectedNode ||
      !selectedNode.nodeDataUrl
    ) {
      return;
    }

    modelRenderRef.current?.setMaterialTexture(
      loadTextureMaterialName,
      selectedNode.nodeDataUrl
    );

    dispatch(
      addMaterialTexture({
        materialName: loadTextureMaterialName,
        nodeId: selectedNode?.nodeId,
      })
    );

    dispatch(loadTextureForMaterialDone());
  }, [loadTextureMaterialName]);

  const handleCameraChange = useCallback((cameraState: CameraState) => {
    dispatch(updateCameraState(cameraState));
  }, []);

  const handleMaterialsChanged = (materialItems: MaterialItemState[]): void => {
    dispatch(updateMaterialStates(materialItems));
  };

  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    if (resetCameraTrigger != ResetCameraTrigger.START) {
      return;
    }
    dispatch(resettingCamera());
    resetCamera();
    dispatch(finishResetCamera());
  }, [resetCameraTrigger]);

  const resetCamera = (): void => {
    cameraRef.current?.reset(modelRenderRef.current?.getScene());
  };

  const handleModelLoaded = (): void => {
    if (isModelFromPluginDataLoaded) {
      dispatch(triggerResetCamera());
    } else {
      dispatch(triggerResetCamera());
      if (viewerStateFromPlugin) {
        setTimeout(() => {
          dispatch(updateCameraState({ ...viewerStateFromPlugin.cameraState }));
          dispatch(
            updateModelPosition({
              ...viewerStateFromPlugin.modelState.position,
            })
          );
          dispatch(
            updateModelRotation({
              ...viewerStateFromPlugin.modelState.rotation,
            })
          );
          dispatch(
            setEnvironmentPreset(viewerStateFromPlugin.environmentState.preset!)
          );
          dispatch(
            setLightIntensity(
              viewerStateFromPlugin.environmentState.lightIntensity!
            )
          );
        }, 0);
      }

      if (
        selectedNodes &&
        modelViewerState.modelSelection &&
        modelViewerState.modelSelection.materialTextures
      ) {
        for (const materialTexture of modelViewerState.modelSelection
          .materialTextures) {
          const node = selectedNodes.filter(
            (i) => i.nodeId === materialTexture.nodeId
          )[0];
          if (node && node.nodeDataUrl) {
            modelRenderRef.current?.setMaterialTexture(
              materialTexture.materialName,
              node.nodeDataUrl
            );
          }
        }
      }

      setIsModelFromPluginDataLoaded(true);
    }

    let modelPosition = modelRenderRef.current?.getPosition();
    if (modelPosition) {
      dispatch(updateModelPosition(modelPosition));
    }

    let modelRotation = modelRenderRef.current?.getRotation();
    if (modelRotation) {
      dispatch(updateModelRotation(modelRotation));
    }
  };

  const exportScale: number = useAppSelector((state) => state.exportState.scale);

  const exportImage = async (): Promise<any> => {
    if (!modelRenderRef.current || !rootState) {
      return;
    }

    const renderer: WebGLRenderer = rootState.gl;
    const scene: Scene = rootState.scene;
    const camera: THREE.Camera = rootState.camera;

    const pixelRatio = renderer.getPixelRatio();

    renderer.setPixelRatio(exportScale);
    renderer.render(scene, camera);

    const image: string = renderer.domElement.toDataURL("image/png", 1);

    renderer.setPixelRatio(pixelRatio);

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

  const actionState: ExportState = useAppSelector((state) => state.exportState);

  const exportImageState = actionState.exportImage;

  useEffect(() => {
    if (exportImageState != ExportImageState.START) {
      return;
    }
    exportImage();
    dispatch(updateExportImageState(ExportImageState.FINISHED));
  }, [exportImageState]);

  const [rootState, setRootState] = useState<RootState>();

  const onCanvasCreated = (rootState: RootState) => {
    rootState.gl.physicallyCorrectLights = true;
    rootState.gl.toneMapping = NoToneMapping;
    setRootState(rootState);
  };

  const environmentState: EnvironmentState = useAppSelector(
    (state) => state.modelViewerState.environmentState
  );

  return (
    <>
      {path && (
        <ModelViewerContainer>
          <Canvas
            ref={canvasRef}
            flat
            frameloop="always"
            dpr={[1, 2]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
            }}
            onCreated={onCanvasCreated}
          >
            <ambientLight intensity={environmentState.lightIntensity} />
            <directionalLight intensity={1.1} position={[0.5, 0, 0.866]} />
            <directionalLight intensity={0.8} position={[-6, 2, 2]} />
            <Suspense fallback={null}>
              <ModelRender
                path={path}
                modelState={{ ...modelState }}
                materialsChanged={handleMaterialsChanged}
                onLoaded={handleModelLoaded}
                ref={modelRenderRef}
              />
              <Environment
                preset={environmentState.preset as EnvironmentPreset}
              />
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
  background: #c9c9c9
    url('data:image/svg+xml,\
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill-opacity=".15">\
      <rect x="200" width="200" height="200" />\
      <rect y="200" width="200" height="200" />\
    </svg>');
  background-size: 20px 20px;
`;

export default ModelViewer;
