import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useListUserProjects, useDeleteProject } from '../../hooks/useQueries';
import { Trash2, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPanel() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: projects, isLoading } = useListUserProjects();
  const deleteProject = useDeleteProject();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Please login to view your projects</p>
      </div>
    );
  }

  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate({ to: '/editor', search: { projectId } });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Projects</h1>
        <p className="text-muted-foreground">Manage your saved photo edits</p>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <button
            onClick={() => navigate({ to: '/editor' })}
            className="px-6 py-2 bg-accent hover:bg-accent/80 text-accent-foreground rounded-md font-medium transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors cursor-pointer group"
              onClick={() => handleOpenProject(project.id)}
            >
              <div className="aspect-video bg-muted flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.effectLayers.length} effect{project.effectLayers.length !== 1 ? 's' : ''}
                </p>
                
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  disabled={deleteProject.isPending}
                  className="w-full px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
