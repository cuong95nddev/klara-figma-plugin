import { Select } from "antd";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { defaultModel } from "../../components/ModelRender";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { ModelSelection } from "../ModelViewer";
import { updateModelSelection } from "../ModelViewer/ModelViewerSlide";

const { Option } = Select;

interface ModelManagerProps {}

const ModelManager: FunctionComponent<ModelManagerProps> = () => {
  const dispatch = useAppDispatch();
  const modelSelection: ModelSelection = useAppSelector(
    (state) => state.modelViewerState.modelSelection
  );

  const handleProvinceChange = (value: any) => {
    const id: number = value as number;
    dispatch(
      updateModelSelection({
        isDefault: true,
        id: id,
      })
    );
  };

  return (
    <ModelManagerContainer>
      <ModelSelect
        onChange={handleProvinceChange}
        value={modelSelection ? modelSelection.id : null}
      >
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
