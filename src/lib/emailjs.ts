import emailjs from '@emailjs/browser';

export interface EmailParams {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const sendContactEmail = async (params: EmailParams): Promise<boolean> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey || serviceId === 'service_your_id') {
    return false;
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: params.name,
      from_email: params.email,
      subject: params.subject || 'Portfolio Inquiry',
      message: params.message,
    },
    publicKey
  );

  return true;
};
