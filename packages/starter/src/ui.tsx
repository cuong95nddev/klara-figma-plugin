import { Button } from "antd";
import "antd/dist/antd.css";
import { FunctionComponent } from "react";
import { render } from "./render";

interface UIProps {}

const UI: FunctionComponent<UIProps> = () => {
  return (
    <div>
      <Button type="primary">Primary Button</Button>
    </div>
  );
};

export default render(UI);
