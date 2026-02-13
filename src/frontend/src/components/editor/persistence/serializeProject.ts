import { ExternalBlob } from '../../../backend';
import type { PhotoProject, EffectLayer } from '../../../backend';
import type { EditorState } from '../state/editorReducer';
import type { Principal } from '@dfinity/principal';

export async function serializeProject(
  editorState: EditorState,
  title: string,
  creator: Principal
): Promise<PhotoProject> {
  if (!editorState.baseImage) {
    throw new Error('No base image to save');
  }

  const response = await fetch(editorState.baseImage.url);
  const blob = await response.blob();
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const baseImageBlob = ExternalBlob.fromBytes(bytes);

  const effectLayers: EffectLayer[] = editorState.layers.map((layer) => ({
    name: layer.name,
    intensity: BigInt(Math.round(layer.opacity * 100)),
    config: JSON.stringify({
      effectId: layer.effectId,
      assetPath: layer.assetPath,
      customImageUrl: layer.customImageUrl,
      transform: layer.transform,
      visible: layer.visible,
    }),
  }));

  return {
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    baseImage: baseImageBlob,
    effectLayers,
    creator,
  };
}

export function deserializeProject(project: PhotoProject): EditorState {
  const baseImageUrl = project.baseImage.getDirectURL();

  const layers = project.effectLayers.map((effectLayer, index) => {
    const config = JSON.parse(effectLayer.config);
    return {
      id: `${config.effectId}-${index}-${Date.now()}`,
      effectId: config.effectId,
      name: effectLayer.name,
      assetPath: config.assetPath,
      customImageUrl: config.customImageUrl,
      transform: config.transform,
      opacity: Number(effectLayer.intensity) / 100,
      visible: config.visible ?? true,
    };
  });

  return {
    baseImage: {
      url: baseImageUrl,
      width: 1920,
      height: 1080,
      file: new File([], 'restored.jpg'),
    },
    layers,
    selectedLayerId: null,
    viewport: { zoom: 1, panX: 0, panY: 0 },
  };
}
