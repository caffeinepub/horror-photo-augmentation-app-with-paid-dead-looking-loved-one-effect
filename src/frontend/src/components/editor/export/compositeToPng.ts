import type { EditorState } from '../state/editorReducer';

export async function compositeToPng(editorState: EditorState): Promise<void> {
  if (!editorState.baseImage) {
    throw new Error('No base image');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  canvas.width = editorState.baseImage.width;
  canvas.height = editorState.baseImage.height;

  const baseImg = new Image();
  baseImg.src = editorState.baseImage.url;
  await new Promise((resolve, reject) => {
    baseImg.onload = resolve;
    baseImg.onerror = reject;
  });

  ctx.drawImage(baseImg, 0, 0);

  for (const layer of editorState.layers) {
    if (!layer.visible) continue;

    const imageUrl = layer.customImageUrl || layer.assetPath;
    if (!imageUrl) continue;

    const layerImg = new Image();
    layerImg.src = imageUrl;
    await new Promise((resolve, reject) => {
      layerImg.onload = resolve;
      layerImg.onerror = reject;
    });

    ctx.save();
    ctx.globalAlpha = layer.opacity;

    const centerX = layer.transform.x + (layerImg.width * layer.transform.scale) / 2;
    const centerY = layer.transform.y + (layerImg.height * layer.transform.scale) / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((layer.transform.rotation * Math.PI) / 180);
    ctx.scale(layer.transform.flipX ? -1 : 1, 1);
    ctx.scale(layer.transform.scale, layer.transform.scale);

    ctx.drawImage(layerImg, -layerImg.width / 2, -layerImg.height / 2);

    ctx.restore();
  }

  canvas.toBlob((blob) => {
    if (!blob) throw new Error('Failed to create blob');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phantom-edit-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
