'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import CharacterCard from '../../components/CharacterCard';
import CharacterForm from '../../components/CharacterForm';
import { Riona } from '../../lib/rionaApi';
import { showToast } from '../../lib/utils';

export default function CharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const data = await Riona.listCharacters();
      setCharacters(data);
    } catch (error) {
      console.error('Failed to load characters:', error);
      showToast('Failed to load characters', 'error');
      // Use mock data as fallback
      setCharacters([
        {
          id: 'arcan-edge',
          name: 'ArcanEdge System Agent',
          bio: 'Advanced AI agent specialized in social media automation and engagement. Designed to interact naturally while maintaining professional boundaries.',
          topics: ['technology', 'ai', 'automation', 'social media'],
          style: 'professional',
          voiceModel: 'gemini-2.0-flash',
          active: true
        },
        {
          id: 'elon-character',
          name: 'Tech Entrepreneur',
          bio: 'Innovative entrepreneur focused on technology and space exploration. Known for direct communication and revolutionary ideas.',
          topics: ['technology', 'space', 'innovation', 'entrepreneurship'],
          style: 'casual',
          voiceModel: 'gemini-pro',
          active: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (formData) => {
    try {
      const newCharacter = {
        ...formData,
        id: formData.name.toLowerCase().replace(/\s+/g, '-'),
        active: characters.length === 0 // Make first character active
      };
      
      await Riona.createCharacter(newCharacter);
      await loadCharacters();
      setShowForm(false);
      showToast('Character created successfully', 'success');
    } catch (error) {
      console.error('Failed to create character:', error);
      showToast(`Failed to create character: ${error.message}`, 'error');
    }
  };

  const handleUpdateCharacter = async (formData) => {
    try {
      const updatedCharacter = {
        ...editingCharacter,
        ...formData
      };
      
      // This would be an update API call
      // await Riona.updateCharacter(editingCharacter.id, updatedCharacter);
      
      // For now, update locally
      setCharacters(prev => prev.map(char => 
        char.id === editingCharacter.id ? updatedCharacter : char
      ));
      
      setShowForm(false);
      setEditingCharacter(null);
      showToast('Character updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update character:', error);
      showToast(`Failed to update character: ${error.message}`, 'error');
    }
  };

  const handleDeleteCharacter = (characterId) => {
    setCharacters(prev => prev.filter(char => char.id !== characterId));
  };

  const handleEditCharacter = (character) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Character Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage AI personalities for different use cases
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Character</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Characters Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-accent rounded w-32"></div>
                  <div className="h-3 bg-accent rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-accent rounded"></div>
                <div className="h-3 bg-accent rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchTerm ? 'No characters found' : 'No characters yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by creating your first AI character'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create Character</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map(character => (
            <div key={character.filename || character.name} className="relative group">
              <CharacterCard
                character={character}
                onUpdate={loadCharacters}
                onDelete={handleDeleteCharacter}
              />
              <button
                onClick={() => handleEditCharacter(character)}
                className="absolute top-4 right-14 p-2 rounded-lg bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
                title="Edit character"
              >
                <span className="sr-only">Edit</span>
                ✏️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Character Form Modal */}
      <CharacterForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCharacter(null);
        }}
        onSubmit={editingCharacter ? handleUpdateCharacter : handleCreateCharacter}
        initialData={editingCharacter}
      />
    </div>
  );
}