import { emit } from "@create-figma-plugin/utilities";
import React, { useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { render } from "./render";
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
    <div>
      <button onClick={handleInsertCodeButtonClick}>AHIHI</button>
    </div>
  );
};

export default render(App);