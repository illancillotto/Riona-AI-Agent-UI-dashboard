'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CharacterForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bio: initialData?.bio || [''],
    lore: initialData?.lore || [''],
    topics: initialData?.topics || [''],
    style: initialData?.style || '',
    voiceModel: initialData?.voiceModel || 'default'
  });

  const [activeSection, setActiveSection] = useState('basic');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty values
    const cleanedData = {
      ...formData,
      bio: formData.bio.filter(item => item.trim()),
      lore: formData.lore.filter(item => item.trim()),
      topics: formData.topics.filter(item => item.trim())
    };
    
    onSubmit(cleanedData);
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const sections = [
    { id: 'basic', name: 'Basic Info' },
    { id: 'personality', name: 'Personality' },
    { id: 'knowledge', name: 'Knowledge' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {initialData ? 'Edit Character' : 'Create New Character'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-border">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {section.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(90vh-120px)]">
          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Character Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    placeholder="Enter character name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Style
                  </label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  >
                    <option value="">Select style</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="witty">Witty</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Voice Model
                  </label>
                  <select
                    value={formData.voiceModel}
                    onChange={(e) => setFormData(prev => ({ ...prev, voiceModel: e.target.value }))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-pro">Gemini Pro</option>
                  </select>
                </div>
              </div>
            )}

            {/* Personality Section */}
            {activeSection === 'personality' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Biography
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('bio')}
                      className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.bio.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <textarea
                          value={item}
                          onChange={(e) => updateArrayItem('bio', index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm min-h-[80px]"
                          placeholder="Enter biography details..."
                        />
                        {formData.bio.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('bio', index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Topics
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('topics')}
                      className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.topics.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateArrayItem('topics', index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                          placeholder="Enter topic..."
                        />
                        {formData.topics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('topics', index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Knowledge Section */}
            {activeSection === 'knowledge' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Lore & Background
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('lore')}
                      className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.lore.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <textarea
                          value={item}
                          onChange={(e) => updateArrayItem('lore', index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm min-h-[100px]"
                          placeholder="Enter lore or background information..."
                        />
                        {formData.lore.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('lore', index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {initialData ? 'Update Character' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}