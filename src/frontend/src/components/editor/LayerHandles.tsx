import { useState, useRef } from 'react';
import type { EditorState, EditorAction } from './state/editorReducer';

interface LayerHandlesProps {
  editorState: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export default function LayerHandles({ editorState, dispatch }: LayerHandlesProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, layerX: 0, layerY: 0 });

  const selectedLayer = editorState.layers.find((l) => l.id === editorState.selectedLayerId);

  if (!selectedLayer || !selectedLayer.visible) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      layerX: selectedLayer.transform.x,
      layerY: selectedLayer.transform.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStartRef.current.x) / editorState.viewport.zoom;
    const dy = (e.clientY - dragStartRef.current.y) / editorState.viewport.zoom;

    dispatch({
      type: 'UPDATE_LAYER_TRANSFORM',
      payload: {
        id: selectedLayer.id,
        transform: {
          x: dragStartRef.current.layerX + dx,
          y: dragStartRef.current.layerY + dy,
        },
      },
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: selectedLayer.transform.x,
        top: selectedLayer.transform.y,
        width: 300 * selectedLayer.transform.scale,
        height: 300 * selectedLayer.transform.scale,
        border: '2px solid oklch(var(--accent))',
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
