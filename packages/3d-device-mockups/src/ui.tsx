import { emit } from "@create-figma-plugin/utilities";
import React, { useCallback, useState } from "react";
import { Provider } from "react-redux";
import Viewer from "./features/Viewer";
import ViewerSetting from "./features/ViewerSetting";
import { render } from "./render";
import stores from "./stores";
import { InsertCodeHandler } from "./types";

const App = () => {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`);
  const handleInsertCodeButtonClick = useCallback(
    function () {
      emit<InsertCodeHandler>("INSERT_CODE", code);
    },
    [code]
  );
  return (
    <Provider store={stores}>
      <div>
        <div style={{ height: "400px", backgroundColor: "gray" }}>
          <Viewer />
        </div>
        <div>
          <ViewerSetting />
        </div>
      </div>
    </Provider>
  );
};

export default render(App);
