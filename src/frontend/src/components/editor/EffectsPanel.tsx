import { useState } from 'react';
import { effectsCatalog } from './effects/effectsCatalog';
import { useHasPaidAccess } from '../../hooks/useQueries';
import { Lock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { EditorState, EditorAction } from './state/editorReducer';
import type { EffectLayerData } from './state/editorTypes';
import DeadLovedOneFlow from './paid/DeadLovedOneFlow';
import UpgradePanel from '../upgrade/UpgradePanel';

interface EffectsPanelProps {
  editorState: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

export default function EffectsPanel({ editorState, dispatch }: EffectsPanelProps) {
  const { data: hasPaidAccess, isLoading: paidLoading } = useHasPaidAccess();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showDeadLovedOneFlow, setShowDeadLovedOneFlow] = useState(false);

  const handleAddEffect = (effectId: string) => {
    const effect = effectsCatalog.find((e) => e.id === effectId);
    if (!effect) return;

    if (effect.isPaid && !hasPaidAccess) {
      setShowUpgrade(true);
      return;
    }

    if (effect.isPaid) {
      setShowDeadLovedOneFlow(true);
      return;
    }

    const newLayer: EffectLayerData = {
      id: `${effectId}-${Date.now()}`,
      effectId: effect.id,
      name: effect.name,
      assetPath: effect.assetPath,
      transform: effect.defaultTransform,
      opacity: effect.defaultOpacity,
      visible: true,
    };

    dispatch({ type: 'ADD_LAYER', payload: newLayer });
    toast.success(`${effect.name} added`);
  };

  const handleDeadLovedOneAdded = (layer: EffectLayerData) => {
    dispatch({ type: 'ADD_LAYER', payload: layer });
    setShowDeadLovedOneFlow(false);
    toast.success('Dead-Looking Loved One added');
  };

  return (
    <>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Effects Library</h2>

        <div className="mb-6">
          <img
            src="/assets/generated/effects-pack-preview.dim_1600x900.png"
            alt="Effects Preview"
            className="w-full rounded-md border border-border mb-4 opacity-80"
          />
        </div>

        <div className="space-y-2">
          {effectsCatalog.map((effect) => {
            const isLocked = effect.isPaid && !hasPaidAccess;

            return (
              <button
                key={effect.id}
                onClick={() => handleAddEffect(effect.id)}
                disabled={paidLoading}
                className="w-full p-3 bg-card hover:bg-accent/10 border border-border rounded-md text-left transition-colors flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                  <div>
                    <div className="font-medium text-foreground">{effect.name}</div>
                    {isLocked && (
                      <div className="text-xs text-muted-foreground">Premium Effect</div>
                    )}
                  </div>
                </div>
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {showUpgrade && <UpgradePanel onClose={() => setShowUpgrade(false)} />}
      {showDeadLovedOneFlow && (
        <DeadLovedOneFlow
          onComplete={handleDeadLovedOneAdded}
          onCancel={() => setShowDeadLovedOneFlow(false)}
        />
      )}
    </>
  );
}
