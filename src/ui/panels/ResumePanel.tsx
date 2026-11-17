import React, { useState } from 'react';
import { Download, ExternalLink, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { resumeContent } from '../../data/content';

export const ResumePanel: React.FC = () => {
  const resumeUrl = '/documents/Tanish_Kumar_Resume.pdf';
  const [viewMode, setViewMode] = useState<'pdf' | 'digital'>('digital');

  return (
    <div className="space-y-4">
      {/* Top Controls & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <button
            onClick={() => setViewMode('digital')}
            className={`px-3 py-1.5 rounded-lg border-2 border-[#3A2A1E] text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'digital'
                ? 'bg-[#F6B73C] shadow-[0_2px_0_#3A2A1E]'
                : 'bg-[#FFF6E3] hover:bg-white text-[#4A382B]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Digital Resume (Recommended)</span>
          </button>

          <button
            onClick={() => setViewMode('pdf')}
            className={`px-3 py-1.5 rounded-lg border-2 border-[#3A2A1E] text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'pdf'
                ? 'bg-[#F6B73C] shadow-[0_2px_0_#3A2A1E]'
                : 'bg-[#FFF6E3] hover:bg-white text-[#4A382B]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF File</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-[#266F73] text-white border-2 border-[#3A2A1E] rounded-lg font-bold text-xs shadow-[0_2px_0_#3A2A1E] hover:bg-[#2e8a8f] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </a>

          <a
            href={resumeUrl}
            download="Tanish_Kumar_Resume.pdf"
            className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-[#F6B73C] text-[#3A2A1E] border-2 border-[#3A2A1E] rounded-lg font-bold text-xs shadow-[0_2px_0_#3A2A1E] hover:bg-[#ffc652] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'pdf' ? (
        <div className="relative rounded-xl border-2 border-[#3A2A1E] bg-white shadow-[0_4px_0_#3A2A1E] overflow-hidden">
          {/* Robust PDF Viewer with Object Embed & Fallback */}
          <object
            data={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full h-[540px] sm:h-[600px] border-none bg-white"
          >
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              title="Tanish Kumar Resume PDF"
              className="w-full h-[540px] sm:h-[600px] border-none bg-white"
            >
              <div className="p-8 text-center flex flex-col items-center justify-center h-full gap-4 bg-[#FFFDF7]">
                <FileText className="w-12 h-12 text-[#266F73]" />
                <div>
                  <h4 className="font-extrabold text-base text-[#3A2A1E]">
                    Tanish Kumar &mdash; Resume PDF
                  </h4>
                  <p className="text-xs text-[#6B5A4B] mt-1 max-w-md">
                    Click below to open the official PDF in a full-page viewer or switch to the interactive Digital Resume tab.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#266F73] text-white rounded-xl text-xs font-bold border-2 border-[#3A2A1E] shadow-[0_2px_0_#3A2A1E] flex items-center gap-1.5 hover:bg-[#2e8a8f]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open PDF in New Tab</span>
                  </a>
                  <button
                    onClick={() => setViewMode('digital')}
                    className="px-4 py-2 bg-[#F6B73C] text-[#3A2A1E] rounded-xl text-xs font-bold border-2 border-[#3A2A1E] shadow-[0_2px_0_#3A2A1E] flex items-center gap-1.5 hover:bg-[#ffc652]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Digital Resume</span>
                  </button>
                </div>
              </div>
            </iframe>
          </object>

          <div className="p-2.5 bg-[#FFF1D6] border-t-2 border-[#3A2A1E] text-center text-[11px] font-mono text-[#4A382B] flex items-center justify-center gap-2">
            <span>Scroll directly inside the viewer to read all sections.</span>
            <span className="hidden sm:inline">&middot;</span>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#266F73] font-bold hover:underline"
            >
              Open Fullscreen &rarr;
            </a>
          </div>
        </div>
      ) : (
        /* Digital Resume Format */
        <div className="p-6 bg-white border-2 border-[#3A2A1E] rounded-xl shadow-[0_4px_0_#3A2A1E] space-y-6 text-[#3A2A1E] max-h-[580px] overflow-y-auto">
          {/* Header */}
          <div className="border-b-2 border-[#3A2A1E]/20 pb-4 text-center sm:text-left">
            <h3 className="text-2xl font-extrabold uppercase tracking-tight text-[#3A2A1E]">
              {resumeContent.personal.name}
            </h3>
            <p className="text-xs sm:text-sm font-mono font-bold text-[#266F73] mt-1">
              {resumeContent.personal.headline}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs font-mono text-[#4A382B]/80">
              <span>{resumeContent.personal.location}</span>
              <span>&bull;</span>
              <a href={`mailto:${resumeContent.personal.email}`} className="text-[#266F73] hover:underline">
                {resumeContent.personal.email}
              </a>
              <span>&bull;</span>
              <a href={resumeContent.personal.githubUrl} target="_blank" rel="noreferrer" className="text-[#266F73] hover:underline">
                {resumeContent.personal.github}
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-[#D9503F] tracking-wider mb-2">
              Professional Summary
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-[#4A382B]">
              {resumeContent.personal.professionalSummary}
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-[#D9503F] tracking-wider mb-2">
              Technical Skills
            </h4>
            <div className="space-y-1.5 text-xs text-[#4A382B]">
              {resumeContent.technicalSkills.map((cat) => (
                <div key={cat.category} className="leading-snug">
                  <strong className="text-[#3A2A1E]">{cat.category}:</strong>{' '}
                  <span>{cat.skills.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-[#D9503F] tracking-wider mb-2">
              Experience
            </h4>
            {resumeContent.experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-bold">
                  <span>{exp.role}</span>
                  <span className="font-mono text-xs text-[#266F73]">{exp.duration}</span>
                </div>
                <div className="text-xs text-[#266F73] font-semibold italic">
                  {exp.organization}, {exp.college}
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4A382B] pt-1">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured AI Projects */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-[#D9503F] tracking-wider mb-2">
              Featured AI Projects
            </h4>
            <div className="space-y-4">
              {resumeContent.featuredProjects.map((p) => (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span>
                      {p.name} &mdash; <span className="font-normal text-xs">{p.subtitle}</span>
                    </span>
                    <span className="font-mono text-xs text-[#266F73]">{p.date}</span>
                  </div>
                  <p className="text-xs text-[#4A382B] leading-relaxed">
                    {p.overview}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.metrics.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/30 rounded text-[10px] font-mono font-bold text-[#3A2A1E]"
                      >
                        {m.label}: {m.value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#3A2A1E]/10">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-[#D9503F] tracking-wider mb-1">
                Education
              </h4>
              <p className="text-xs font-bold text-[#3A2A1E]">
                {resumeContent.education.institution}
              </p>
              <p className="text-xs text-[#266F73]">{resumeContent.education.degree}</p>
              <p className="text-[11px] font-mono text-[#4A382B] mt-0.5">
                {resumeContent.education.period} &bull; CGPA: {resumeContent.education.cgpa}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-[#D9503F] tracking-wider mb-1">
                Achievements
              </h4>
              <ul className="space-y-1 text-xs text-[#4A382B]">
                {resumeContent.achievements.map((ach, aIdx) => (
                  <li key={aIdx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#266F73] shrink-0" />
                    <span>{ach.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
