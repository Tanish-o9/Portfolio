import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

export const ResumePanel: React.FC = () => {
  const resumeUrl = '/documents/Tanish_Kumar_Resume.pdf';

  return (
    <div className="text-center py-6 space-y-6">
      <div className="w-16 h-16 mx-auto bg-[#FFF1D6] border-2 border-[#3A2A1E] rounded-2xl flex items-center justify-center shadow-[0_4px_0_#3A2A1E]">
        <FileText className="w-8 h-8 text-[#266F73]" />
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#3A2A1E] mb-2">
          Tanish Kumar's Curriculum Vitae
        </h3>
        <p className="text-xs sm:text-sm text-[#4A382B] max-w-md mx-auto leading-relaxed">
          Verified single source of truth containing real AI/ML engineering experience, projects, metrics, and academic milestones.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-[#266F73] text-white border-2 border-[#3A2A1E] rounded-xl font-bold text-sm shadow-[0_3px_0_#3A2A1E] hover:bg-[#2e8a8f] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Resume PDF</span>
        </a>

        <a
          href={resumeUrl}
          download="Tanish_Kumar_Resume.pdf"
          className="w-full sm:w-auto px-6 py-3 bg-[#F6B73C] text-[#3A2A1E] border-2 border-[#3A2A1E] rounded-xl font-bold text-sm shadow-[0_3px_0_#3A2A1E] hover:bg-[#ffc652] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </a>
      </div>
    </div>
  );
};
