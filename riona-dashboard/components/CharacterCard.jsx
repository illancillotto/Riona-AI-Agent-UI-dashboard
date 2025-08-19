'use client';

import { useState } from 'react';
import { User, Check, Trash2, Edit } from 'lucide-react';
import { cn } from '../lib/utils';
import { Riona } from '../lib/rionaApi';
import { showToast } from '../lib/utils';

export default function CharacterCard({ character, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleSetActive = async () => {
    if (character.active) return;
    
    setLoading(true);
    try {
      await Riona.setCharacter(character.id);
      showToast(`${character.name} is now the active character`, 'success');
      onUpdate();
    } catch (error) {
      showToast(`Failed to set character: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${character.name}?`)) return;
    
    setLoading(true);
    try {
      await Riona.deleteCharacter(character.id);
      showToast(`${character.name} deleted successfully`, 'success');
      onDelete(character.id);
    } catch (error) {
      showToast(`Failed to delete character: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "bg-card rounded-lg border p-6 shadow-sm hover:shadow-md transition-all",
      character.active && "ring-2 ring-primary border-primary"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            character.active ? "bg-primary text-primary-foreground" : "bg-accent"
          )}>
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{character.name}</h3>
            {character.active && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {!character.active && (
            <button
              onClick={handleSetActive}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              title="Set as active"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={loading || character.active}
            className="p-2 rounded-lg hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
            title="Delete character"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Bio</p>
          <p className="text-sm text-foreground line-clamp-3">
            {character.bio || 'No bio available'}
          </p>
        </div>

        {character.topics && character.topics.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Topics</p>
            <div className="flex flex-wrap gap-1">
              {character.topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                >
                  {topic}
                </span>
              ))}
              {character.topics.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{character.topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}