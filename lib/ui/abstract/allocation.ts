export type Allocation = {
  type: "pixel" | "relative";
  size: number;
  minSize?: number;
  minElementSize: {
    width: number;
    height: number;
  };
  resizable: boolean;
  setByUser: boolean;
};
