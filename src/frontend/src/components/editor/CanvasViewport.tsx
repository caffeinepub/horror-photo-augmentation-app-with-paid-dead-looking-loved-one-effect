import { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { EditorState, EditorAction } from './state/editorReducer';
import LayerHandles from './LayerHandles';

interface CanvasViewportProps {
  editorState: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export default function CanvasViewport({ editorState, dispatch }: CanvasViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, editorState.viewport.zoom * delta));
    dispatch({ type: 'SET_VIEWPORT', payload: { zoom: newZoom } });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - editorState.viewport.panX, y: e.clientY - editorState.viewport.panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      dispatch({
        type: 'SET_VIEWPORT',
        payload: { panX: e.clientX - panStart.x, panY: e.clientY - panStart.y },
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(5, editorState.viewport.zoom * 1.2);
    dispatch({ type: 'SET_VIEWPORT', payload: { zoom: newZoom } });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, editorState.viewport.zoom * 0.8);
    dispatch({ type: 'SET_VIEWPORT', payload: { zoom: newZoom } });
  };

  const handleResetView = () => {
    dispatch({ type: 'RESET_VIEWPORT' });
  };

  if (!editorState.baseImage) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-muted/20">
      <div
        ref={containerRef}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${editorState.viewport.panX}px, ${editorState.viewport.panY}px) scale(${editorState.viewport.zoom})`,
            transformOrigin: '0 0',
            position: 'relative',
          }}
        >
          <img
            src={editorState.baseImage.url}
            alt="Base"
            style={{
              display: 'block',
              maxWidth: 'none',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />

          {editorState.layers.map((layer) => {
            if (!layer.visible) return null;

            const imageUrl = layer.customImageUrl || layer.assetPath;
            if (!imageUrl) return null;

            return (
              <div
                key={layer.id}
                style={{
                  position: 'absolute',
                  left: layer.transform.x,
                  top: layer.transform.y,
                  transform: `scale(${layer.transform.scale}) rotate(${layer.transform.rotation}deg) scaleX(${layer.transform.flipX ? -1 : 1})`,
                  transformOrigin: 'center',
                  opacity: layer.opacity,
                  pointerEvents: 'none',
                }}
              >
                <img
                  src={imageUrl}
                  alt={layer.name}
                  style={{
                    display: 'block',
                    maxWidth: '300px',
                    userSelect: 'none',
                  }}
                />
              </div>
            );
          })}

          <LayerHandles editorState={editorState} dispatch={dispatch} />
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-card border border-border rounded-md hover:bg-accent/10 transition-colors shadow-lg"
        >
          <ZoomIn className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-card border border-border rounded-md hover:bg-accent/10 transition-colors shadow-lg"
        >
          <ZoomOut className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-card border border-border rounded-md hover:bg-accent/10 transition-colors shadow-lg"
        >
          <Maximize2 className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="absolute top-4 left-4 px-3 py-1 bg-card border border-border rounded-md text-sm text-muted-foreground shadow-lg">
        {Math.round(editorState.viewport.zoom * 100)}%
      </div>
    </div>
  );
}
