'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SupabaseAsset } from '@/types';
import { X, Plus, Globe, Lock, Check } from 'lucide-react';

interface SaveModalProps {
  assetId: string;
  onClose: () => void;
  onSave: () => void;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  is_public: boolean;
  created_at: string;
}

export default function SaveModal({ assetId, onClose, onSave }: SaveModalProps) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [creatingCollection, setCreatingCollection] = useState(false);

  useEffect(() => {
    loadCollections();
  }, [user]);

  const loadCollections = async () => {
    if (!user) return;
    
    try {
      // Get user's collections
      const { data: collectionsData, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(collectionsData || []);

      // Check which collections already have this asset
      const { data: existingSaves } = await supabase
        .from('saves')
        .select('collection_id')
        .eq('user_id', user.id)
        .eq('asset_id', assetId);

      if (existingSaves) {
        setSelectedCollections(existingSaves.map((s: any) => s.collection_id));
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCollectionName.trim()) return;

    setCreatingCollection(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: user.id,
          name: newCollectionName,
          description: newCollectionDescription,
          is_public: false
        })
        .select()
        .single();

      if (error) throw error;

      setCollections([data, ...collections]);
      setSelectedCollections([...selectedCollections, data.id]);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateForm(false);
      toast.success('Collection created');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setCreatingCollection(false);
    }
  };

  const toggleCollection = (collectionId: string) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(selectedCollections.filter((id: string) => id !== collectionId));
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Remove from collections that were unchecked
      const { data: existingSaves } = await supabase
        .from('saves')
        .select('collection_id')
        .eq('user_id', user.id)
        .eq('asset_id', assetId);

      const existingCollectionIds = existingSaves?.map((s: any) => s.collection_id) || [];
      const toRemove = existingCollectionIds.filter((id: string) => !selectedCollections.includes(id));
      const toAdd = selectedCollections.filter((id: string) => !existingCollectionIds.includes(id));

      // Remove unchecked saves
      if (toRemove.length > 0) {
        await supabase
          .from('saves')
          .delete()
          .eq('user_id', user.id)
          .eq('asset_id', assetId)
          .in('collection_id', toRemove);
      }

      // Add new saves
      if (toAdd.length > 0) {
        const savesToInsert = toAdd.map((collectionId: string) => ({
          user_id: user.id,
          asset_id: assetId,
          collection_id: collectionId
        }));

        await supabase
          .from('saves')
          .insert(savesToInsert);
      }

      toast.success('Saved to collections');
      onSave();
    } catch (error) {
      console.error('Error saving to collections:', error);
      toast.error('Failed to save to collections');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-zinc-900 rounded-xl shadow-2xl z-50 border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">Save to Collection</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <>
              {/* Create new collection button */}
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
                >
                  <Plus className="w-4 h-4" />
                  Create New Collection
                </button>
              )}

              {/* Create collection form */}
              {showCreateForm && (
                <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                  <form onSubmit={handleCreateCollection}>
                    <div className="mb-3">
                      <label htmlFor="collection-name" className="block text-sm font-medium text-zinc-300 mb-1">
                        Collection name
                      </label>
                      <input
                        id="collection-name"
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Enter collection name"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="collection-description" className="block text-sm font-medium text-zinc-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="collection-description"
                        value={newCollectionDescription}
                        onChange={(e) => setNewCollectionDescription(e.target.value)}
                        placeholder="Enter description (optional)"
                        rows={2}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!newCollectionName.trim() || creatingCollection}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        {creatingCollection ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setNewCollectionName('');
                          setNewCollectionDescription('');
                        }}
                        className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Collections list */}
              <div>
                {collections.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-zinc-500">
                    No collections yet. Create one to start saving!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {collections.map((collection) => (
                      <div
                        key={collection.id}
                        onClick={() => toggleCollection(collection.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedCollections.includes(collection.id)
                            ? 'bg-blue-500/10 border border-blue-500/30'
                            : 'bg-zinc-800 hover:bg-zinc-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedCollections.includes(collection.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-zinc-600'
                          }`}>
                            {selectedCollections.includes(collection.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-zinc-100">{collection.name}</h3>
                              {collection.is_public ? (
                                <Globe className="w-3 h-3 text-zinc-500" />
                              ) : (
                                <Lock className="w-3 h-3 text-zinc-500" />
                              )}
                            </div>
                            {collection.description && (
                              <p className="text-sm text-zinc-500 mt-0.5">
                                {collection.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selectedCollections.length === 0}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </>
  );
}
