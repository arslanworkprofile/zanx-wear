'use client';

import { MessageCircle } from 'lucide-react';

// WhatsApp number in international format (Pakistan +92), no spaces or symbols.
const WHATSAPP_NUMBER = '923329272560';
const WHATSAPP_MESSAGE = 'Hi ZANX WEAR, I have a question about your products.';

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] p-4 text-white shadow-premium transition-all duration-300 ease-out hover:gap-2 hover:pr-5 hover:shadow-[0_20px_60px_-10px_rgba(37,211,102,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-matte-black"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50 [animation-duration:2.2s] group-hover:hidden" />
      <MessageCircle className="h-6 w-6 shrink-0 fill-white" strokeWidth={0} />
      <span className="max-w-0 whitespace-nowrap text-sm font-medium tracking-tight opacity-0 transition-all duration-300 ease-out group-hover:max-w-[140px] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
