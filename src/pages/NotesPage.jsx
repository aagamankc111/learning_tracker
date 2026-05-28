import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { useTopics } from '../hooks/useTopics';
import FadeIn from '../components/common/FadeIn';

export default function NotesPage() {
  const { user } = useAuth();
  const { topics } = useTopics();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [isCodeSnippet, setIsCodeSnippet] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const allSubtopics = topics.flatMap((t) => t.subtopics || []);

  useEffect(() => {
    if (!user) return;
    fetchNotes();
  }, [user]);

  async function fetchNotes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*, subtopic:subtopics(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!content.trim() || !selectedSubtopic) return;

    try {
      if (editingId) {
        const { error } = await supabase
          .from('user_notes')
          .update({ content: content.trim(), is_code_snippet: isCodeSnippet, updated_at: new Date().toISOString() })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_notes')
          .insert({
            user_id: user.id,
            subtopic_id: Number(selectedSubtopic),
            content: content.trim(),
            is_code_snippet: isCodeSnippet,
          });
        if (error) throw error;
      }
      setContent('');
      setSelectedSubtopic('');
      setIsCodeSnippet(false);
      setEditingId(null);
      await fetchNotes();
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  }

  function handleEdit(note) {
    setContent(note.content);
    setSelectedSubtopic(String(note.subtopic_id));
    setIsCodeSnippet(note.is_code_snippet);
    setEditingId(note.id);
  }

  async function handleDelete(id) {
    try {
      const { error } = await supabase.from('user_notes').delete().eq('id', id);
      if (error) throw error;
      await fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  }

  const codeNotes = notes.filter((n) => n.is_code_snippet);
  const textNotes = notes.filter((n) => !n.is_code_snippet);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-2">Learning</span>
          <h1 className="text-2xl sm:text-3xl font-bold">Notes & Code Snippets</h1>
          <p className="text-amber-100 mt-1 text-sm">
            Save notes, key concepts, and code snippets as you learn. Short reusable code for quick reference.
          </p>
        </div>
      </FadeIn>

      {/* Add Note Form */}
      <FadeIn delay={50}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{editingId ? 'Edit Note' : 'Add New Note'}</h2>
          <div className="space-y-3">
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="">Select a subtopic...</option>
              {allSubtopics.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isCodeSnippet ? 'Paste your code snippet here...' : 'Write your notes here...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none min-h-[120px] font-mono"
            />

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCodeSnippet}
                  onChange={(e) => setIsCodeSnippet(e.target.checked)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 accent-amber-600"
                />
                This is a code snippet
              </label>
              <div className="flex-1" />
              {editingId && (
                <button onClick={() => { setContent(''); setSelectedSubtopic(''); setIsCodeSnippet(false); setEditingId(null); }}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!content.trim() || !selectedSubtopic}
                className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition disabled:opacity-50"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Code Snippets */}
      {codeNotes.length > 0 && (
        <FadeIn delay={100}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Code Snippets ({codeNotes.length})</h2>
            <div className="space-y-3">
              {codeNotes.map((note) => (
                <div key={note.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-mono">
                      {note.subtopic?.title || `Subtopic #${note.subtopic_id}`}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(note)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(note.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition">
                        Delete
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(note.content)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <pre className="text-green-400 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {note.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Text Notes */}
      {textNotes.length > 0 && (
        <FadeIn delay={150}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📝 Notes ({textNotes.length})</h2>
            <div className="space-y-3">
              {textNotes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-200 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-amber-600">
                      {note.subtopic?.title || `Subtopic #${note.subtopic_id}`}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(note)}
                        className="text-xs text-indigo-500 hover:text-indigo-600 transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(note.id)}
                        className="text-xs text-red-500 hover:text-red-600 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {!loading && notes.length === 0 && (
        <FadeIn>
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg mb-1">No notes yet</p>
            <p className="text-sm">Save notes and code snippets as you learn each topic.</p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
