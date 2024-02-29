export function isUndo(event) {
  // TODO: comply with Windows, Mac and Linux undo shortcuts
  return event.ctrlKey && ['Z', 'z'].indexOf(event.key) !== -1;
}

export function isRedo(event) {
  // TODO: comply with Windows, Mac and Linux redo shortcuts
  return event.ctrlKey && ['Y', 'y'].indexOf(event.key) !== -1;
}