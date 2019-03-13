export default function defaultGetHelperDimensions({node}) {
  return {
    height: node.offsetHeight,
    width: node.offsetWidth,
  };
}
