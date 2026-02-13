import { Trash2, Eye, EyeOff, ChevronUp, ChevronDown, FlipHorizontal } from 'lucide-react';
import type { EditorState, EditorAction } from './state/editorReducer';

interface LayerInspectorProps {
  editorState: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export default function LayerInspector({ editorState, dispatch }: LayerInspectorProps) {
  const selectedLayer = editorState.layers.find((l) => l.id === editorState.selectedLayerId);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Layers</h2>

      {editorState.layers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No layers yet. Add effects from the left panel.
        </p>
      ) : (
        <div className="space-y-2 mb-6">
          {editorState.layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`p-3 rounded-md border transition-colors cursor-pointer ${
                layer.id === editorState.selectedLayerId
                  ? 'bg-accent/20 border-accent'
                  : 'bg-card border-border hover:border-accent/50'
              }`}
              onClick={() => dispatch({ type: 'SELECT_LAYER', payload: layer.id })}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground truncate">{layer.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layer.id });
                    }}
                    className="p-1 hover:bg-accent/10 rounded transition-colors"
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'REMOVE_LAYER', payload: layer.id });
                    }}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'MOVE_LAYER_UP', payload: layer.id });
                  }}
                  disabled={index === editorState.layers.length - 1}
                  className="p-1 hover:bg-accent/10 rounded transition-colors disabled:opacity-30"
                >
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'MOVE_LAYER_DOWN', payload: layer.id });
                  }}
                  disabled={index === 0}
                  className="p-1 hover:bg-accent/10 rounded transition-colors disabled:opacity-30"
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLayer && (
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Layer Properties</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedLayer.opacity}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_LAYER_OPACITY',
                    payload: { id: selectedLayer.id, opacity: parseFloat(e.target.value) },
                  })
                }
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {Math.round(selectedLayer.opacity * 100)}%
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Scale</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={selectedLayer.transform.scale}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_LAYER_TRANSFORM',
                    payload: { id: selectedLayer.id, transform: { scale: parseFloat(e.target.value) } },
                  })
                }
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {selectedLayer.transform.scale.toFixed(1)}x
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={selectedLayer.transform.rotation}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_LAYER_TRANSFORM',
                    payload: { id: selectedLayer.id, transform: { rotation: parseFloat(e.target.value) } },
                  })
                }
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {selectedLayer.transform.rotation}°
              </div>
            </div>

            <button
              onClick={() =>
                dispatch({
                  type: 'UPDATE_LAYER_TRANSFORM',
                  payload: { id: selectedLayer.id, transform: { flipX: !selectedLayer.transform.flipX } },
                })
              }
              className="w-full px-4 py-2 bg-card hover:bg-accent/10 border border-border rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FlipHorizontal className="w-4 h-4" />
              Flip Horizontal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
