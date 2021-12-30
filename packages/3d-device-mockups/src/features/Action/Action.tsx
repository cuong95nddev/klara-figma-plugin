import { Button } from "antd";
import React, { FunctionComponent } from "react";
import { ExportImageState } from ".";
import { useAppDispatch } from "../../hooks";
import { updateExportImageState } from "./ActionSlide";

interface ActionProps {}

const Action: FunctionComponent<ActionProps> = () => {
  const dispatch = useAppDispatch();

  const handleExportImage = (): void => {
    dispatch(updateExportImageState(ExportImageState.START));
  };

  return (
    <div>
      <Button block type="primary">
        Export image
      </Button>
    </div>
  );
};

export default Action;
