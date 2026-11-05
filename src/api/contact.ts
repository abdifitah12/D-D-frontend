export interface ContactInquiry {
  name: string;
  email: string;
  date?: string;
  guests?: string;
  message: string;
}

export async function sendContactInquiry(
  inquiry: ContactInquiry,
): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "Email sending is not configured. Set the EmailJS service ID, template ID, and public key.",
    );
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        to_email: "dndcafe.to@gmail.com",
        name: inquiry.name,
        email: inquiry.email,
        reply_to: inquiry.email,
        date: inquiry.date || "TBD",
        guests: inquiry.guests || "TBD",
        message: inquiry.message,
      },
    }),
  });

  const result = await response.text();
  if (!response.ok) {
    throw new Error(result || `Email service returned ${response.status}.`);
  }
}
