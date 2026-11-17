import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { soundEffects } from '../../game/systems/soundEffects';
import { useGameStore } from '../../state/gameStore';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  avatar: number;
  created_at: string;
}

const AVATARS = ['🤖', '💻', '🚀', '🧠', '⚙️', '🔍', '⚡', '☕'];

export const GuestbookPanel: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // Fetch approved entries
  useEffect(() => {
    useGameStore.getState().completeQuest('guestbook_sign');
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    const fetchEntries = async () => {
      try {
        const { data, error } = await client
          .from('guestbook')
          .select('id, name, message, avatar, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data) {
          setEntries(data as GuestbookEntry[]);
        }
      } catch (err) {
        console.warn('Guestbook fetch error:', err);
      }
    };

    fetchEntries();

    // Realtime subscription for newly approved guestbook entries
    const channel = client
      .channel('guestbook_public')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guestbook' },
        (payload) => {
          const newEntry = payload.new as GuestbookEntry & { approved: boolean };
          if (newEntry.approved) {
            setEntries((prev) => [newEntry, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot || cooldown) return;
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    soundEffects.playClick();

    // Sanitize string text (strip HTML tags)
    const cleanName = name.replace(/<[^>]*>?/gm, '').trim().slice(0, 40);
    const cleanMessage = message.replace(/<[^>]*>?/gm, '').trim().slice(0, 280);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('guestbook').insert([
          {
            name: cleanName,
            message: cleanMessage,
            avatar: selectedAvatar,
            approved: false, // Pending moderation
          },
        ]);
      } catch (err) {
        console.warn('Guestbook insert error:', err);
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    setCooldown(true);
    setName('');
    setMessage('');

    // 60s cooldown per browser
    setTimeout(() => setCooldown(false), 60000);
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] space-y-3"
      >
        {/* Honeypot field */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Your Name (max 40)
            </label>
            <input
              type="text"
              required
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E] focus:outline-none focus:ring-2 focus:ring-[#266F73]"
              placeholder="e.g. Fellow AI Researcher"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Select Avatar
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(idx)}
                  className={`w-8 h-8 rounded-lg border-2 border-[#3A2A1E] flex items-center justify-center text-sm transition-transform ${
                    selectedAvatar === idx ? 'bg-[#F6B73C] scale-110 shadow-sm font-bold' : 'bg-white'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
            Public Message ({280 - message.length} chars left)
          </label>
          <textarea
            required
            maxLength={280}
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2.5 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E] focus:outline-none focus:ring-2 focus:ring-[#266F73] resize-none"
            placeholder="Sign the village guestbook..."
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#3A2A1E]/70">
            <ShieldCheck className="w-3.5 h-3.5 text-[#266F73]" />
            <span>Row-level safety & moderation</span>
          </div>

          <button
            type="submit"
            disabled={submitting || cooldown}
            className="py-2 px-5 bg-[#F6B73C] hover:bg-[#ffc652] text-[#3A2A1E] font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 text-xs sm:text-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Signing...' : cooldown ? 'Cooldown (60s)' : 'Sign it'}</span>
          </button>
        </div>

        {submitted && (
          <div className="p-3 bg-[#E8F5E9] border border-[#2E7D32] rounded-lg text-xs font-semibold text-[#2E7D32] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Thanks! Your message has been submitted and will appear in the town square after moderation.</span>
          </div>
        )}
      </form>

      {/* Entries List or Empty State */}
      <div className="space-y-3">
        {entries.length > 0 ? (
          entries.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_2px_0_#3A2A1E] flex items-start gap-3"
            >
              <div className="text-2xl p-1 bg-[#FFF1D6] border border-[#3A2A1E]/30 rounded-lg">
                {AVATARS[item.avatar] || '👤'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#3A2A1E] truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#3A2A1E]/60">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-xs text-[#4A382B] mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 bg-[#FFF1D6] border-2 border-[#3A2A1E] rounded-xl text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-[#266F73] mx-auto opacity-70" />
            <h4 className="font-bold text-sm text-[#3A2A1E]">
              Town Square Guestbook
            </h4>
            <p className="text-xs text-[#4A382B]">
              No approved entries yet. Be the first to sign!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
