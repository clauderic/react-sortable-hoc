export default function defaultShouldCancelStart(event) {
  // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
  const disabledElements = ['input', 'textarea', 'select', 'option', 'button'];

  if (disabledElements.indexOf(event.target.tagName.toLowerCase()) !== -1) {
    // Return true to cancel sorting
    return true;
  }

  return false;
}
