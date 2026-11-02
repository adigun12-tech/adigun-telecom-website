
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = "2347042723692";
  const message = encodeURIComponent(
    "Hello Adigun Telecom, I would like to make an enquiry about your technology services."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Contact Adigun Telecom on WhatsApp"
    >
      <MessageCircle size={27} />
      <span>Chat with us</span>
    </a>
  );
}
