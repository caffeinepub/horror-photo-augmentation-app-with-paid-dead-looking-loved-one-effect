import { useReducer, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetProject } from '../../hooks/useQueries';
import CanvasViewport from './CanvasViewport';
import EffectsPanel from './EffectsPanel';
import LayerInspector from './LayerInspector';
import SaveProjectButton from './SaveProjectButton';
import ExportButton from './ExportButton';
import ConsentGate from '../consent/ConsentGate';
import { loadImageFile } from './hooks/useImageFile';
import { editorReducer, initialEditorState } from './state/editorReducer';
import { deserializeProject } from './persistence/serializeProject';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function PhotoEditorPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { projectId?: string };
  const { identity } = useInternetIdentity();
  const getProject = useGetProject();
  const [editorState, dispatch] = useReducer(editorReducer, initialEditorState);
  const [consentGiven, setConsentGiven] = useState(() => {
    return localStorage.getItem('phantom-edit-consent') === 'true';
  });

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (search.projectId && isAuthenticated) {
      getProject.mutateAsync(search.projectId).then((project) => {
        const restored = deserializeProject(project);
        dispatch({ type: 'RESTORE_STATE', payload: restored });
        toast.success('Project loaded successfully');
      }).catch((error) => {
        toast.error('Failed to load project');
        console.error(error);
      });
    }
  }, [search.projectId, isAuthenticated]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await loadImageFile(file);
      dispatch({
        type: 'SET_BASE_IMAGE',
        payload: imageData,
      });
      toast.success('Image loaded successfully');
    } catch (error) {
      toast.error('Failed to load image');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Please login to use the editor</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="px-6 py-2 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-medium transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  if (!editorState.baseImage) {
    return (
      <div className="container mx-auto px-4 py-16">
        <button
          onClick={() => navigate({ to: '/' })}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="max-w-2xl mx-auto text-center">
          <Upload className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4 text-foreground">Start Your Haunted Creation</h1>
          <p className="text-muted-foreground mb-8">
            Upload a photo to begin adding paranormal effects
          </p>

          <label className="inline-block px-8 py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-semibold cursor-pointer transition-colors">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <>
      {!consentGiven && (
        <ConsentGate onConsent={() => setConsentGiven(true)} />
      )}

      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="border-b border-border bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-3">
              <SaveProjectButton editorState={editorState} />
              <ExportButton editorState={editorState} consentGiven={consentGiven} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-border bg-card/30 overflow-y-auto">
            <EffectsPanel editorState={editorState} dispatch={dispatch} />
          </div>

          <div className="flex-1 bg-background">
            <CanvasViewport editorState={editorState} dispatch={dispatch} />
          </div>

          <div className="w-80 border-l border-border bg-card/30 overflow-y-auto">
            <LayerInspector editorState={editorState} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </>
  );
}
