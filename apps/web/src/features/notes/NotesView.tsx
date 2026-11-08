import { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Folder,
  Tag,
  Trash2,
  BookOpen,
  Edit3,
  Eye,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { NoteItem } from '@nexus/types';

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n1',
    user_id: 'u1',
    title: 'NEXUS Autonomous Personal Operating System Architecture',
    content: `# NEXUS System Architecture\n\nNEXUS is engineered as a unified personal intelligence system rather than isolated productivity silos.\n\n## Core Pillars\n1. **Unified Ambient Core:** Seamless data synthesis across tasks, calendar, habits, and financial cashflow.\n2. **Multi-Agent Runtime:** Autonomous tool-calling copilot with access to your knowledge vault and schedule.\n3. **Cognitive Ergonomics:** Pastel aurora ambient styling designed to reduce friction and cognitive fatigue.`,
    folder: 'Architecture',
    tags: ['system', 'ai', 'core'],
    is_pinned: true,
    is_archived: false,
    created_at: '2026-05-01',
    updated_at: '2026-05-06',
  },
  {
    id: 'n2',
    user_id: 'u1',
    title: 'Design Philosophy: Frosted Glassmorphism & Aurora Gradients',
    content: `### Visual Language Specs\n- Background: radial gradient mesh (#E1EDFB, #FBEBE8, #EFE9FD, #DFE7FB)\n- Card surfaces: rgba(255, 255, 255, 0.82) with 16px blur\n- Micro-actions: pill buttons with rounded-full geometry (#F1F3F8)`,
    folder: 'Design',
    tags: ['ui', 'tokens'],
    is_pinned: true,
    is_archived: false,
    created_at: '2026-05-02',
    updated_at: '2026-05-05',
  },
  {
    id: 'n3',
    user_id: 'u1',
    title: 'Executive Meeting Brief: Leadership Alignment',
    content: `Agenda items:\n- Review Q2 delivery roadmaps.\n- Cross-module synchronization of calendar buffer slots.\n- Autonomous assistant security boundaries with Row Level Security.`,
    folder: 'Meetings',
    tags: ['leadership', 'strategy'],
    is_pinned: false,
    is_archived: false,
    created_at: '2026-05-04',
    updated_at: '2026-05-04',
  },
  {
    id: 'n4',
    user_id: 'u1',
    title: 'Personal Investment Theses & Asset Allocation',
    content: `Target allocations:\n- Liquid Emergency Reserve: 6 months living expenses\n- Broad Index Equities: 70%\n- Real Estate & Alternative Yield: 20%\n- Asymmetric Tech: 10%`,
    folder: 'Finance',
    tags: ['finance', 'wealth'],
    is_pinned: false,
    is_archived: false,
    created_at: '2026-05-05',
    updated_at: '2026-05-05',
  },
];

const FOLDERS = ['All', 'Architecture', 'Design', 'Meetings', 'Finance', 'Ideas'];

export function NotesView() {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(INITIAL_NOTES[0].id);
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { addToast } = useToastStore();

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      user_id: 'current-user',
      title: 'Untitled Note',
      content: 'Write your thoughts, ideas, or documentation here...',
      folder: selectedFolder === 'All' ? 'General' : selectedFolder,
      tags: ['new'],
      is_pinned: false,
      is_archived: false,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
    addToast({
      type: 'success',
      title: 'Note Created',
      message: 'New knowledge vault entry initialized.',
    });
  };

  const handleUpdateNote = (field: 'title' | 'content', value: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, [field]: value } : n))
    );
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_pinned: !n.is_pinned } : n))
    );
  };

  const handleDeleteNote = (id: string, title: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (selectedNoteId === id && remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
    }
    addToast({
      type: 'info',
      title: 'Note Removed',
      message: `"${title}" was removed from knowledge vault.`,
    });
  };

  const filteredNotes = notes.filter((n) => {
    const matchesFolder = selectedFolder === 'All' || n.folder === selectedFolder;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notes & Knowledge Vault</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              {notes.length} entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal wiki, markdown documentation, and networked intelligence.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCreateNote}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Capture Note
        </Button>
      </div>

      {/* Main Two-Column Vault Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Folders & Note Entries List (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Search & Folder Pills */}
          <Card variant="glass" className="p-3.5 rounded-2xl space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, tags, or concepts..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/90 border border-slate-200/80 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {FOLDERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFolder(f)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0',
                    selectedFolder === f
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800 bg-white/60'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Card>

          {/* Notes List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                No notes found
              </div>
            ) : (
              filteredNotes.map((n) => {
                const isSelected = n.id === selectedNoteId;

                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNoteId(n.id)}
                    className={cn(
                      'p-4 rounded-2xl border transition-all cursor-pointer relative group',
                      isSelected
                        ? 'bg-white shadow-md border-indigo-200 ring-1 ring-indigo-100'
                        : 'bg-white/70 hover:bg-white/95 border-slate-100/80 shadow-xs'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4
                        className={cn(
                          'text-xs font-semibold leading-snug truncate',
                          isSelected ? 'text-indigo-950 font-bold' : 'text-slate-900'
                        )}
                      >
                        {n.title}
                      </h4>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(n.id);
                        }}
                        className={cn(
                          'p-1 text-slate-300 hover:text-amber-500 transition-colors shrink-0',
                          n.is_pinned && 'text-amber-500'
                        )}
                        title={n.is_pinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {n.content.replace(/^#+ /, '')}
                    </p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100/60 text-[10px] text-slate-400">
                      <span className="font-medium text-indigo-600">{n.folder}</span>
                      <span>{n.updated_at}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Reading & Editing Surface (7 cols) */}
        <div className="md:col-span-7">
          {activeNote ? (
            <Card variant="glass" className="p-6 sm:p-8 rounded-3xl min-h-[550px] flex flex-col justify-between">
              <div>
                {/* Note Header Controls */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Folder className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-semibold text-slate-700">{activeNote.folder}</span>
                    <span>• Last saved {activeNote.updated_at}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all',
                        isEditing
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      {isEditing ? <Eye className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                      <span>{isEditing ? 'Preview Mode' : 'Edit Mode'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteNote(activeNote.id, activeNote.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title Editor / Display */}
                {isEditing ? (
                  <input
                    value={activeNote.title}
                    onChange={(e) => handleUpdateNote('title', e.target.value)}
                    className="w-full text-xl font-bold text-slate-900 bg-transparent border-b border-indigo-200 pb-2 mb-4 focus:outline-none"
                    placeholder="Note title..."
                  />
                ) : (
                  <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
                    {activeNote.title}
                  </h2>
                )}

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                  {activeNote.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Content Editor / Display */}
                {isEditing ? (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => handleUpdateNote('content', e.target.value)}
                    rows={16}
                    className="w-full text-xs font-mono bg-white/70 border border-slate-200/80 rounded-2xl p-4 focus:outline-none focus:border-indigo-400 leading-relaxed resize-none"
                    placeholder="Markdown content supported..."
                  />
                ) : (
                  <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-wrap">
                    {activeNote.content}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      addToast({
                        type: 'success',
                        title: 'Note Saved',
                        message: 'Changes written to knowledge vault.',
                      });
                    }}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Done Editing
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card variant="glass" className="p-12 text-center rounded-3xl text-slate-400">
              Select or create a note to begin.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

