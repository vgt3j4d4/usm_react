export const focusNoteById = (noteId) => {
  const el = document.querySelector(`[data-note-id="${noteId}"]`);
  if (el) el.focus({ focusVisible: true });
}