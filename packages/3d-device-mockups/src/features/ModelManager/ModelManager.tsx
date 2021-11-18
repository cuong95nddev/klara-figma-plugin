import { Select } from "antd";
import { SelectValue } from "antd/lib/select";
import { FunctionComponent } from "react";
import styled from "styled-components";
import defaultModel from "../../components/ModelRender/DefaultModel";
import { useAppDispatch } from "../../hooks";
import { updateModelPath } from "../ModelViewer/ModelViewerSlide";

const { Option } = Select;

interface ModelManagerProps {}

const ModelManager: FunctionComponent<ModelManagerProps> = () => {
  const dispatch = useAppDispatch();

  const handleChangeModel = (value: SelectValue): void => {
    const modelID: number = value as number;
    const modelPath: string | undefined = defaultModel.find(
      (m) => m.id === modelID
    )?.path;

    if (!modelPath) {
      return;
    }

    dispatch(updateModelPath(modelPath!));
  };

  return (
    <ModelManagerContainer>
      <ModelSelect onChange={handleChangeModel}>
        {defaultModel.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </ModelSelect>
    </ModelManagerContainer>
  );
};

const ModelManagerContainer = styled.div``;

const ModelSelect = styled(Select)`
  width: 100%;
`;

export default ModelManager;
