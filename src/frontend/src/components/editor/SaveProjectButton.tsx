import { useState } from 'react';
import { Save } from 'lucide-react';
import { useSaveProject } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { serializeProject } from './persistence/serializeProject';
import type { EditorState } from './state/editorReducer';
import { toast } from 'sonner';

interface SaveProjectButtonProps {
  editorState: EditorState;
}

export default function SaveProjectButton({ editorState }: SaveProjectButtonProps) {
  const { identity } = useInternetIdentity();
  const saveProject = useSaveProject();
  const [projectTitle, setProjectTitle] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleSave = async () => {
    if (!identity || !editorState.baseImage) {
      toast.error('Cannot save: missing data');
      return;
    }

    if (!projectTitle.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    try {
      const project = await serializeProject(editorState, projectTitle.trim(), identity.getPrincipal());
      await saveProject.mutateAsync(project);
      toast.success('Project saved successfully!');
      setShowDialog(false);
      setProjectTitle('');
    } catch (error: any) {
      if (error.message?.includes('Paid tier required')) {
        toast.error('Premium effect requires paid tier to save');
      } else {
        toast.error('Failed to save project');
      }
      console.error(error);
    }
  };

  if (!editorState.baseImage) return null;

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="px-4 py-2 bg-card hover:bg-accent/10 border border-border rounded-md font-medium transition-colors flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Project
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Save Project</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2 bg-card hover:bg-accent/10 border border-border rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveProject.isPending || !projectTitle.trim()}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {saveProject.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
