import {NodeType} from '../utils';

export default function defaultShouldCancelStart(event) {
  // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
  const disabledElements = [
    NodeType.Input,
    NodeType.Textarea,
    NodeType.Select,
    NodeType.Option,
    NodeType.Button,
  ];

  if (disabledElements.indexOf(event.target.tagName) !== -1) {
    // Return true to cancel sorting
    return true;
  }

  return false;
}
