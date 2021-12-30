export enum ExportImageState {
  START,
  EXPORTING,
  FINISHED,
}

export default interface ActionState {
  exportImage: ExportImageState;
}
