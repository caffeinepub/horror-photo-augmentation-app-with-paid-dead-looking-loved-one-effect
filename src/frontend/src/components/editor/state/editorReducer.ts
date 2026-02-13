import type { EffectLayerData, ViewportTransform, Transform } from './editorTypes';
import type { ImageFileData } from '../hooks/useImageFile';

export interface EditorState {
  baseImage: ImageFileData | null;
  layers: EffectLayerData[];
  selectedLayerId: string | null;
  viewport: ViewportTransform;
}

export const initialEditorState: EditorState = {
  baseImage: null,
  layers: [],
  selectedLayerId: null,
  viewport: { zoom: 1, panX: 0, panY: 0 },
};

export type EditorAction =
  | { type: 'SET_BASE_IMAGE'; payload: ImageFileData }
  | { type: 'ADD_LAYER'; payload: EffectLayerData }
  | { type: 'REMOVE_LAYER'; payload: string }
  | { type: 'SELECT_LAYER'; payload: string | null }
  | { type: 'UPDATE_LAYER_TRANSFORM'; payload: { id: string; transform: Partial<Transform> } }
  | { type: 'UPDATE_LAYER_OPACITY'; payload: { id: string; opacity: number } }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: string }
  | { type: 'MOVE_LAYER_UP'; payload: string }
  | { type: 'MOVE_LAYER_DOWN'; payload: string }
  | { type: 'SET_VIEWPORT'; payload: Partial<ViewportTransform> }
  | { type: 'RESET_VIEWPORT' }
  | { type: 'RESTORE_STATE'; payload: EditorState };

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_BASE_IMAGE':
      return { ...state, baseImage: action.payload, layers: [], selectedLayerId: null };

    case 'ADD_LAYER':
      return { ...state, layers: [...state.layers, action.payload], selectedLayerId: action.payload.id };

    case 'REMOVE_LAYER':
      return {
        ...state,
        layers: state.layers.filter((l) => l.id !== action.payload),
        selectedLayerId: state.selectedLayerId === action.payload ? null : state.selectedLayerId,
      };

    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.payload };

    case 'UPDATE_LAYER_TRANSFORM':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.payload.id
            ? { ...l, transform: { ...l.transform, ...action.payload.transform } }
            : l
        ),
      };

    case 'UPDATE_LAYER_OPACITY':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.payload.id ? { ...l, opacity: action.payload.opacity } : l
        ),
      };

    case 'TOGGLE_LAYER_VISIBILITY':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.payload ? { ...l, visible: !l.visible } : l
        ),
      };

    case 'MOVE_LAYER_UP': {
      const index = state.layers.findIndex((l) => l.id === action.payload);
      if (index < state.layers.length - 1) {
        const newLayers = [...state.layers];
        [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
        return { ...state, layers: newLayers };
      }
      return state;
    }

    case 'MOVE_LAYER_DOWN': {
      const index = state.layers.findIndex((l) => l.id === action.payload);
      if (index > 0) {
        const newLayers = [...state.layers];
        [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
        return { ...state, layers: newLayers };
      }
      return state;
    }

    case 'SET_VIEWPORT':
      return { ...state, viewport: { ...state.viewport, ...action.payload } };

    case 'RESET_VIEWPORT':
      return { ...state, viewport: { zoom: 1, panX: 0, panY: 0 } };

    case 'RESTORE_STATE':
      return action.payload;

    default:
      return state;
  }
}
