declare class InfiniteComputer {
  getTotalScrollableHeight(): number;
  getDisplayIndexStart(windowTop: number): number;
  getDisplayIndexEnd(windowBottom: number): number;
  getTopSpacerHeight(displayIndexStart: number): number;
  getBottomSpacerHeight(displayIndexEnd: number): number
};
