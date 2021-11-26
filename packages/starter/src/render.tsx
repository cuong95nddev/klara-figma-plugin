import { FunctionComponent } from "react"
import ReactDOM from "react-dom";
import React from "react";

export function render<P>(Plugin: FunctionComponent<P>) {
  return function (node: HTMLElement, props: P): void {
    ReactDOM.render(
        <Plugin {...props} />,
        document.getElementById("create-figma-plugin")
      );
  }
}