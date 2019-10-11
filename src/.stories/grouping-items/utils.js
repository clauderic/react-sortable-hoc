export function generateItems(length) {
  return Array.from(Array(length), (_, index) => index.toString());
}
