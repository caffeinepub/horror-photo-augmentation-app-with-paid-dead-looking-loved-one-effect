export interface Transform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipX: boolean;
}

export interface EffectLayerData {
  id: string;
  effectId: string;
  name: string;
  assetPath?: string;
  customImageUrl?: string;
  transform: Transform;
  opacity: number;
  visible: boolean;
}

export interface ViewportTransform {
  zoom: number;
  panX: number;
  panY: number;
}
