import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { loadImageFile } from '../hooks/useImageFile';
import type { EffectLayerData } from '../state/editorTypes';
import { toast } from 'sonner';

interface DeadLovedOneFlowProps {
  onComplete: (layer: EffectLayerData) => void;
  onCancel: () => void;
}

export default function DeadLovedOneFlow({ onComplete, onCancel }: DeadLovedOneFlowProps) {
  const [loading, setLoading] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageData = await loadImageFile(file);

      const newLayer: EffectLayerData = {
        id: `dead-loved-one-${Date.now()}`,
        effectId: 'dead-loved-one',
        name: 'Dead-Looking Loved One',
        customImageUrl: imageData.url,
        transform: { x: 300, y: 150, scale: 1, rotation: 0, flipX: false },
        opacity: 0.75,
        visible: true,
      };

      onComplete(newLayer);
    } catch (error) {
      toast.error('Failed to load image');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Add Dead-Looking Loved One</h3>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Upload a photo of a person to transform them into a ghostly apparition. This effect will
          be added as a layer that you can position and customize.
        </p>

        <label className="block w-full p-8 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-accent transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <div className="text-sm text-foreground font-medium mb-1">
            {loading ? 'Loading...' : 'Choose Photo'}
          </div>
          <div className="text-xs text-muted-foreground">PNG, JPG up to 10MB</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
