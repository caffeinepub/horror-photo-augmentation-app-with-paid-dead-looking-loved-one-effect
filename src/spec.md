# Specification

## Summary
**Goal:** Build a signed-in horror-themed photo editor that lets users augment their photos with realistic paranormal overlays, export the result, and gate a paid “dead-looking loved one” effect behind a per-user paid status.

**Planned changes:**
- Add an editor flow for signed-in users to upload/select a photo, display it on a canvas, and provide zoom, pan, and reset-to-fit controls.
- Implement an effects library with four overlay effects (creepy shadow man, ghost entity, glowing eyes, disembodied hand) that can be added/removed as independent layers.
- Provide per-layer controls for effect layers: move, scale, rotate, flip horizontally, opacity/intensity, and layer ordering (bring forward/send backward).
- Add export/download to generate a final composited image (e.g., PNG) including the base photo and all visible layers with their transforms and opacity.
- Implement a paid tier that unlocks a locked/paid “dead-looking loved one” effect, blocks non-paid users from exporting if that paid effect is present, and stores/returns per-user paid status from the backend.
- Add a paid-effect workflow to upload/select a second image (the loved one) and place it into the base photo as a layer with the same transform/order/opacity controls.
- Add basic project persistence for signed-in users: save an edit session (base photo reference + layer configuration metadata), list saved projects, and reopen to restore the same configuration.
- Add safety/consent messaging in English requiring users to confirm rights/permission to use uploaded photos and acknowledge edits are for entertainment/fictional effects before exporting.
- Apply a coherent horror/paranormal UI theme (not a generic blue/purple palette) consistently across landing, editor, and upgrade surfaces.
- Render required generated static images from `frontend/public/assets/generated` in the frontend (e.g., logo and subtle background/hero visual).

**User-visible outcome:** Signed-in users can upload a photo, add and manipulate horror effect layers, save and reopen projects, and export a composited image; the “dead-looking loved one” insertion is clearly marked as paid/locked and only paid users can use it to export.
