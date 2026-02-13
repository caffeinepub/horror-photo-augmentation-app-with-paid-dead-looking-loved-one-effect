export interface EffectDefinition {
  id: string;
  name: string;
  assetPath: string;
  isPaid: boolean;
  defaultTransform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    flipX: boolean;
  };
  defaultOpacity: number;
}

export const effectsCatalog: EffectDefinition[] = [
  {
    id: 'shadow-man',
    name: 'Shadow Man',
    assetPath: '/assets/effects/shadow-man.png',
    isPaid: false,
    defaultTransform: { x: 100, y: 100, scale: 1, rotation: 0, flipX: false },
    defaultOpacity: 0.8,
  },
  {
    id: 'ghost-entity',
    name: 'Ghost Entity',
    assetPath: '/assets/effects/ghost-entity.png',
    isPaid: false,
    defaultTransform: { x: 150, y: 150, scale: 1, rotation: 0, flipX: false },
    defaultOpacity: 0.7,
  },
  {
    id: 'glowing-eyes',
    name: 'Glowing Eyes',
    assetPath: '/assets/effects/glowing-eyes.png',
    isPaid: false,
    defaultTransform: { x: 200, y: 100, scale: 1, rotation: 0, flipX: false },
    defaultOpacity: 0.9,
  },
  {
    id: 'disembodied-hand',
    name: 'Disembodied Hand',
    assetPath: '/assets/effects/disembodied-hand.png',
    isPaid: false,
    defaultTransform: { x: 250, y: 200, scale: 1, rotation: 0, flipX: false },
    defaultOpacity: 0.85,
  },
  {
    id: 'dead-loved-one',
    name: 'Dead-Looking Loved One',
    assetPath: '',
    isPaid: true,
    defaultTransform: { x: 300, y: 150, scale: 1, rotation: 0, flipX: false },
    defaultOpacity: 0.75,
  },
];
