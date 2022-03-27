import {Button, Select} from "antd";
import React, {FunctionComponent} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {updateExportImageState, updateExportScale} from "./ExportSlide";
import {ExportImageState} from "./ExportImageState";
import {InputNumber} from "antd/es";

const {Option} = Select;

interface ActionProps {
}

const Export: FunctionComponent<ActionProps> = () => {
    const dispatch = useAppDispatch();

    const scale = useAppSelector((state) => state.exportState.scale);

    const handleExportImage = (): void => {
        dispatch(updateExportImageState(ExportImageState.START));
    };

    const handleScaleChange = (value: number) => {
        dispatch(updateExportScale(value))
    }

    return (
        <div>
            <InputNumber prefix="x" defaultValue={scale} step={0.5} onChange={handleScaleChange}/>
            <Button type="primary" onClick={handleExportImage}>
                Export image
            </Button>
        </div>
    );
};

export default Export;
