import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Ghost } from 'lucide-react';
import LoginButton from '../auth/LoginButton';

export default function Header() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-accent transition-colors"
        >
          <Ghost className="w-6 h-6" />
          <span>Phantom Edit</span>
        </button>
        
        <nav className="flex items-center gap-6">
          {isAuthenticated && (
            <>
              <button
                onClick={() => navigate({ to: '/projects' })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Projects
              </button>
              <button
                onClick={() => navigate({ to: '/editor' })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Editor
              </button>
            </>
          )}
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}
