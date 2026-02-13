import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LandingHero from './LandingHero';
import { Ghost, Image, Layers, Download, Lock } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="relative">
      <LandingHero />

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Haunt Your Photos
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Upload Photos</h3>
            <p className="text-sm text-muted-foreground">
              Start with your existing photos and prepare them for paranormal enhancement
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Ghost className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Add Effects</h3>
            <p className="text-sm text-muted-foreground">
              Insert shadow figures, ghosts, glowing eyes, and disembodied hands
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Layers className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Customize</h3>
            <p className="text-sm text-muted-foreground">
              Move, scale, rotate, and adjust opacity for realistic results
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Download className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Export</h3>
            <p className="text-sm text-muted-foreground">
              Download your haunted masterpiece and share with friends
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 mb-16">
          <div className="flex items-start gap-4">
            <Lock className="w-8 h-8 text-accent shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Premium Effect</h3>
              <p className="text-muted-foreground mb-4">
                Upgrade to unlock the exclusive "Dead-Looking Loved One" effect. Upload a photo of someone
                and transform them into a ghostly apparition that can be seamlessly inserted into your photos.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Perfect for creating spine-chilling memories and paranormal-themed content.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate({ to: isAuthenticated ? '/editor' : '/' })}
            className="px-8 py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-semibold text-lg transition-colors inline-flex items-center gap-2"
          >
            <Ghost className="w-5 h-5" />
            {isAuthenticated ? 'Open Editor' : 'Login to Start'}
          </button>
        </div>
      </section>
    </div>
  );
}
