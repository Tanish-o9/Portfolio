import React, { useState } from 'react';
import { resumeContent } from '../../data/content';
import { Mail, Linkedin, Github, MapPin, Send } from 'lucide-react';

export const ContactPanel: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    const mailto = `mailto:${resumeContent.personal.email}?subject=Village Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Coordinates */}
      <div className="md:col-span-5 space-y-3">
        <div className="text-xs font-mono font-bold uppercase text-[#266F73] mb-2">
          // Coordinates
        </div>

        <a
          href={`mailto:${resumeContent.personal.email}`}
          className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-center gap-2.5 text-xs font-bold text-[#3A2A1E] hover:bg-[#FFF1D6] transition-colors"
        >
          <Mail className="w-4 h-4 text-[#D9503F]" />
          <span className="truncate">{resumeContent.personal.email}</span>
        </a>

        <a
          href={resumeContent.personal.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-center gap-2.5 text-xs font-bold text-[#3A2A1E] hover:bg-[#FFF1D6] transition-colors"
        >
          <Linkedin className="w-4 h-4 text-[#266F73]" />
          <span className="truncate">LinkedIn Profile</span>
        </a>

        <a
          href={resumeContent.personal.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-center gap-2.5 text-xs font-bold text-[#3A2A1E] hover:bg-[#FFF1D6] transition-colors"
        >
          <Github className="w-4 h-4 text-[#3A2A1E]" />
          <span className="truncate">GitHub Profile</span>
        </a>

        <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-center gap-2.5 text-xs font-bold text-[#3A2A1E]">
          <MapPin className="w-4 h-4 text-[#E0674A]" />
          <span className="truncate">{resumeContent.personal.location}</span>
        </div>
      </div>

      {/* Form */}
      <div className="md:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E] focus:outline-none focus:ring-2 focus:ring-[#266F73]"
              placeholder="e.g. Alex"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Your Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E] focus:outline-none focus:ring-2 focus:ring-[#266F73]"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#3A2A1E] mb-1">
              Message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-white border-2 border-[#3A2A1E] rounded-lg text-sm text-[#3A2A1E] focus:outline-none focus:ring-2 focus:ring-[#266F73] resize-none"
              placeholder="Your inquiry or engineering message..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#266F73] text-white font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] hover:bg-[#2e8a8f] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 text-sm"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>

          {submitted && (
            <p className="text-xs font-mono text-[#266F73] text-center font-bold">
              Opening your default mail client with prefilled message!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
