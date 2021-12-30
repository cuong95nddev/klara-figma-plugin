import { Button } from "antd";
import React, { FunctionComponent } from "react";
import { useAppDispatch } from "../../hooks";
import { updateExportImageState } from "./ActionSlide";
import { ExportImageState } from "./ExportImageState";

interface ActionProps {}

const Action: FunctionComponent<ActionProps> = () => {
  const dispatch = useAppDispatch();

  const handleExportImage = (): void => {
    dispatch(updateExportImageState(ExportImageState.START));
  };

  return (
    <div>
      <Button block type="primary" onClick={handleExportImage}>
        Export image
      </Button>
    </div>
  );
};

export default Action;
