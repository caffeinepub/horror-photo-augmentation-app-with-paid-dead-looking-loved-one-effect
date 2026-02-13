import { Download } from 'lucide-react';
import { useHasPaidAccess } from '../../hooks/useQueries';
import { compositeToPng } from './export/compositeToPng';
import type { EditorState } from './state/editorReducer';
import { toast } from 'sonner';
import { useState } from 'react';

interface ExportButtonProps {
  editorState: EditorState;
  consentGiven: boolean;
}

export default function ExportButton({ editorState, consentGiven }: ExportButtonProps) {
  const { data: hasPaidAccess } = useHasPaidAccess();
  const [exporting, setExporting] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const hasPaidEffect = editorState.layers.some((l) => l.effectId === 'dead-loved-one');

  const handleExport = async () => {
    if (!consentGiven) {
      toast.error('Please acknowledge the consent agreement before exporting');
      return;
    }

    if (hasPaidEffect && !hasPaidAccess) {
      setShowUpgradePrompt(true);
      return;
    }

    if (!editorState.baseImage) {
      toast.error('No image to export');
      return;
    }

    setExporting(true);
    try {
      await compositeToPng(editorState);
      toast.success('Image exported successfully!');
    } catch (error) {
      toast.error('Failed to export image');
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={exporting || !editorState.baseImage}
        className="px-4 py-2 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        {exporting ? 'Exporting...' : 'Export'}
      </button>

      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Premium Effect Detected</h3>
            <p className="text-muted-foreground mb-6">
              Your project contains the "Dead-Looking Loved One" premium effect. Please upgrade to the
              paid tier to export images with this effect.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradePrompt(false)}
                className="flex-1 px-4 py-2 bg-card hover:bg-accent/10 border border-border rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUpgradePrompt(false);
                  window.location.href = '/#upgrade';
                }}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-medium transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
