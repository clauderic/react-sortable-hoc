import {NodeType, closest} from '../utils';

export default function defaultShouldCancelStart(event) {
  // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
  const interactiveElements = [
    NodeType.Input,
    NodeType.Textarea,
    NodeType.Select,
    NodeType.Option,
    NodeType.Button,
  ];

  if (interactiveElements.indexOf(event.target.tagName) !== -1) {
    // Return true to cancel sorting
    return true;
  }

  if (closest(event.target, (el) => el.contentEditable === 'true')) {
    return true;
  }

  return false;
}
