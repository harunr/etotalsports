import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Truck,
  ShieldCheck,
  Package,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to eTotalSports Concierge. How can our sports gear specialist assist you today?',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef(null);
  const rawWhatsapp = '+8801811377577';
  const cleanWhatsapp = rawWhatsapp.replace(/[^0-9]/g, '');
  const supportEmail = 'support@etotalsports.com';

  const quickTopics = [
    {
      id: 'delivery',
      icon: Truck,
      label: 'Delivery Rates & Times',
      answer: 'Standard Delivery takes 3–5 working days; Express Delivery takes 1–2 days. Orders over ৳12,200 qualify for FREE standard shipping nationwide.',
      waText: 'Hello eTotalSports team, I want to inquire about shipping times and delivery rates.',
    },
    {
      id: 'authenticity',
      icon: ShieldCheck,
      label: '100% Authentic Gear Guarantee',
      answer: 'Every item at eTotalSports is 100% authentic, sourced directly from authorized sports brands and distributors. All gear ships with original manufacturer tags and packaging.',
      waText: 'Hello, I want to verify authenticity and warranty for a product.',
    },
    {
      id: 'tracking',
      icon: Package,
      label: 'Track My Order',
      answer: 'To track your parcel, share your order ID (e.g. ETS-123456) or message our team directly on WhatsApp for live status updates.',
      waText: 'Hello eTotalSports, I would like to track my order status.',
    },
    {
      id: 'advice',
      icon: Sparkles,
      label: 'Gear & Size Consultation',
      answer: 'Need help choosing the right running shoe width, racket grip size, or gym weight setup? Chat directly with our sports gear specialists on WhatsApp!',
      waText: 'Hello, I need gear and sizing advice for my sport.',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setHasOpened(true);
    }
  }, [isOpen, messages]);

  const handleSelectTopic = (topic) => {
    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: topic.label,
      timestamp: 'Just now',
    };

    const botMsg = {
      id: String(Date.now() + 1),
      sender: 'bot',
      text: topic.answer,
      timestamp: 'Just now',
      action: {
        type: 'whatsapp',
        label: 'Chat on WhatsApp about this',
        url: `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(topic.waText)}`,
      },
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botReply = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: 'Thank you for reaching out! Would you like our sports concierge team to answer your question immediately on WhatsApp?',
        timestamp: 'Just now',
        action: {
          type: 'whatsapp',
          label: 'Continue on WhatsApp',
          url: `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Website Inquiry: ${userText}`)}`,
        },
      };
      setMessages((prev) => [...prev, botReply]);
    }, 500);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[120] flex items-center gap-3">
        {/* Unread Teaser Pill */}
        {!isOpen && !hasOpened && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-onyx text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/10 text-xs font-semibold hover:border-volt transition-all animate-bounce duration-1000"
          >
            <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
            <span>Need gear advice? Chat with us</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close live support chat' : 'Open live support chat'}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-onyx text-volt hover:bg-slate-900 shadow-2xl flex items-center justify-center transition-all duration-300 transform active:scale-95 group focus:outline-none focus:ring-4 focus:ring-volt/30 border-2 border-volt/40"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform rotate-0 group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7" />
              {/* Online indicator */}
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-onyx" />
              </span>

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-volt text-onyx text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-onyx shadow-sm">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="eTotalSports Support Chat"
          className="fixed bottom-24 right-4 sm:right-6 z-[120] w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px] h-[550px] max-h-[82vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-onyx p-4 text-white flex items-center justify-between shrink-0 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-volt/50 flex items-center justify-center text-volt font-display font-extrabold text-base italic">
                  eS
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-onyx" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm tracking-wide uppercase italic flex items-center gap-2">
                  <span>eTotalSports Concierge</span>
                  <span className="text-[10px] bg-volt/20 text-volt font-semibold px-2 py-0.5 rounded-full not-italic">
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Replies in minutes or directly via WhatsApp
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-onyx text-white rounded-br-none'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}

                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <a
                        href={msg.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold hover:bg-[#20ba59] transition-all shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Quick Answer Pills */}
            {messages.length <= 2 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Frequently Asked:
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickTopics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        className="w-full text-left bg-white hover:bg-slate-100 border border-slate-200 hover:border-onyx rounded-xl p-2.5 transition-all flex items-center justify-between group shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-onyx text-volt flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-800 group-hover:text-onyx transition-colors text-xs">
                            {topic.label}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-onyx transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Direct Handoff Footer Bar */}
          <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] shrink-0">
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Direct WhatsApp:</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>+8801811377577</span>
              </a>
              <a
                href={`mailto:${supportEmail}`}
                className="text-slate-600 hover:text-onyx flex items-center gap-1 font-medium"
              >
                <Mail className="w-3 h-3 text-slate-400" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question about sports gear..."
              className="flex-1 h-10 px-3.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-onyx focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-onyx text-volt hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center transition-all shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
