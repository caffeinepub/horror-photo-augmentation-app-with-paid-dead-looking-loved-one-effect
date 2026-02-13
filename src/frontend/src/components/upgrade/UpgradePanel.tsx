import { X, Crown } from 'lucide-react';
import { useUpgradeToPaidTier } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface UpgradePanelProps {
  onClose: () => void;
}

export default function UpgradePanel({ onClose }: UpgradePanelProps) {
  const upgradeMutation = useUpgradeToPaidTier();

  const handleUpgrade = async () => {
    try {
      await upgradeMutation.mutateAsync();
      toast.success('Successfully upgraded to paid tier!');
      onClose();
    } catch (error) {
      toast.error('Failed to upgrade');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-lg w-full p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Upgrade to Premium</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-foreground">Premium Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>
                <strong className="text-foreground">Dead-Looking Loved One Effect:</strong> Upload a photo
                and transform it into a ghostly apparition
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>Save projects with premium effects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>Export images containing premium effects</span>
            </li>
          </ul>
        </div>

        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            This is a demo application. In production, this would integrate with a payment processor.
            For now, clicking upgrade will instantly grant you premium access.
          </p>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={upgradeMutation.isPending}
          className="w-full px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Crown className="w-5 h-5" />
          {upgradeMutation.isPending ? 'Upgrading...' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
}
