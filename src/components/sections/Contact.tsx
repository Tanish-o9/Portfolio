import React, { useState } from 'react';
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { resumeContent } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  websiteHoneypot: string; // Honeypot spam protection
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    websiteHoneypot: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check: if filled, quietly reject bot
    if (formData.websiteHoneypot) {
      setStatus('success');
      setStatusMessage('Message sent successfully!');
      return;
    }

    // Client-side basic validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setStatusMessage('Please provide a valid email address.');
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey && serviceId !== 'service_your_id') {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.fullName,
            from_email: formData.email,
            subject: formData.subject || 'Portfolio Inquiry',
            message: formData.message,
          },
          publicKey
        );
        setStatus('success');
        setStatusMessage('Thank you! Your message has been sent successfully.');
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: '',
          websiteHoneypot: '',
        });
      } catch (err) {
        console.error('EmailJS send error:', err);
        setStatus('error');
        setStatusMessage(
          'Failed to send message via automated service. Please email directly at tanishrajput673@gmail.com'
        );
      }
    } else {
      // Graceful fallback when API keys are not yet configured in production env:
      // Open mailto with prefilled details
      const mailtoUrl = `mailto:${resumeContent.personal.email}?subject=${encodeURIComponent(
        formData.subject || 'Portfolio Inquiry'
      )}&body=${encodeURIComponent(
        `Name: ${formData.fullName}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`;

      window.location.href = mailtoUrl;
      setStatus('success');
      setStatusMessage(
        'Opening your email client to send your message directly to tanishrajput673@gmail.com.'
      );
    }
  };

  return (
    <section id="contact" className="py-20 md:py-24 bg-bg-alt border-t border-border-separator">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Get In Touch"
              title="Let's Build Something"
              titleAccent="Intelligent."
            />

            <p className="text-base sm:text-lg text-text-body leading-relaxed mb-8">
              Whether you are looking to collaborate on agentic AI architectures, LLM inference optimization, or discuss machine learning engineering opportunities, my inbox is open.
            </p>

            {/* Contact Details List */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-card border border-card-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center text-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                    Email
                  </span>
                  <a
                    href={`mailto:${resumeContent.personal.email}`}
                    className="text-sm sm:text-base font-semibold text-text hover:text-accent transition-colors truncate block"
                  >
                    {resumeContent.personal.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-card-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center text-accent shrink-0">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                    LinkedIn
                  </span>
                  <a
                    href={resumeContent.personal.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-semibold text-text hover:text-accent transition-colors truncate block"
                  >
                    {resumeContent.personal.linkedin}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-card-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center text-accent shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                    GitHub
                  </span>
                  <a
                    href={resumeContent.personal.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-semibold text-text hover:text-accent transition-colors truncate block"
                  >
                    {resumeContent.personal.github}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-card-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center text-accent shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">
                    Location
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-text truncate block">
                    {resumeContent.personal.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-card bg-card border border-card-border p-6 sm:p-8 lg:p-10 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-text mb-2">
                Send a Message
              </h3>
              <p className="text-sm text-text-muted mb-6">
                Fill in the details below and I'll get back to you promptly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field - invisible to genuine users */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="websiteHoneypot">Website</label>
                  <input
                    type="text"
                    id="websiteHoneypot"
                    name="websiteHoneypot"
                    value={formData.websiteHoneypot}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2"
                    >
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Mercer"
                      className="w-full h-12 px-4 rounded-btn bg-chip-bg border border-chip-border text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2"
                    >
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. alex@example.com"
                      className="w-full h-12 px-4 rounded-btn bg-chip-bg border border-chip-border text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. AI Engineering Collaboration / Opportunity"
                    className="w-full h-12 px-4 rounded-btn bg-chip-bg border border-chip-border text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono uppercase tracking-wider text-text-muted mb-2"
                  >
                    Message <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your inquiry or engineering project..."
                    className="w-full p-4 rounded-btn bg-chip-bg border border-chip-border text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm resize-none"
                  />
                </div>

                {/* Status Message */}
                {statusMessage && (
                  <div
                    className={`p-3.5 rounded-lg text-xs sm:text-sm flex items-start gap-2.5 ${
                      status === 'success'
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50'
                        : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                    }`}
                  >
                    {status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    )}
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={status === 'loading'}
                  className="w-full justify-center"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
