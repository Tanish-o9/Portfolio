import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const AVATARS = ['🤖', '💻', '🚀', '🧠'];

export const GuestbookPanel: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E]"
              placeholder="e.g. Fellow Engineer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Avatar
            </label>
            <div className="flex gap-1.5">
              {AVATARS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(idx)}
                  className={`w-9 h-9 rounded-lg border-2 border-[#3A2A1E] flex items-center justify-center text-lg transition-transform ${
                    selectedAvatar === idx ? 'bg-[#F6B73C] scale-105 shadow-sm' : 'bg-white'
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
            Message ({280 - message.length} chars left)
          </label>
          <textarea
            required
            maxLength={280}
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2.5 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E] resize-none"
            placeholder="Sign the town-square guestbook..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[#F6B73C] text-[#3A2A1E] font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] hover:bg-[#ffc652] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 text-sm"
        >
          <Send className="w-4 h-4" />
          <span>Sign it</span>
        </button>

        {submitted && (
          <p className="text-xs font-mono text-[#266F73] text-center font-bold">
            Thanks! Your message is queued for moderation.
          </p>
        )}
      </form>

      {/* Empty State Box */}
      <div className="p-8 bg-[#FFF1D6] border-2 border-[#3A2A1E] rounded-xl text-center space-y-2">
        <MessageSquare className="w-8 h-8 text-[#266F73] mx-auto opacity-70" />
        <h4 className="font-bold text-sm text-[#3A2A1E]">
          Town Square Guestbook
        </h4>
        <p className="text-xs text-[#4A382B]">
          No approved entries yet. Be the first to sign!
        </p>
      </div>
    </div>
  );
};
