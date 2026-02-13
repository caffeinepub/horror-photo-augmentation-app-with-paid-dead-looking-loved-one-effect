import { AlertTriangle } from 'lucide-react';

interface ConsentGateProps {
  onConsent: () => void;
}

export default function ConsentGate({ onConsent }: ConsentGateProps) {
  const handleAccept = () => {
    localStorage.setItem('phantom-edit-consent', 'true');
    onConsent();
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-8 shadow-2xl">
        <div className="flex items-start gap-4 mb-6">
          <AlertTriangle className="w-8 h-8 text-accent shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-2 text-foreground">Important Notice</h2>
            <p className="text-muted-foreground">
              Please read and acknowledge the following before using Phantom Edit
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8 text-sm text-muted-foreground">
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Rights & Permissions</h3>
            <p>
              By using this application, you confirm that you have the legal right to edit and modify all
              photos you upload. You must have permission from all individuals depicted in the photos.
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Entertainment Purpose</h3>
            <p>
              This application is designed for entertainment and creative purposes only. The effects are
              fictional and should not be used to deceive, harass, or harm others.
            </p>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Responsible Use</h3>
            <p>
              You are solely responsible for how you use and share the edited images. Always respect the
              privacy and dignity of individuals depicted in photos.
            </p>
          </div>
        </div>

        <button
          onClick={handleAccept}
          className="w-full px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-semibold text-lg transition-colors"
        >
          I Understand and Agree
        </button>
      </div>
    </div>
  );
}
