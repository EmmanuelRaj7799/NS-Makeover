import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Phone,
  User,
} from 'lucide-react';
import {
  buildWhatsAppUrl,
  EVENT_TYPES,
  EventType,
  PageRoute,
  SERVICE_NAMES,
  ServiceName,
  STUDIO_CONTACT,
} from '../data/studioContent';

interface BookingSectionProps {
  selectedServices: ServiceName[];
  onToggleService: (service: ServiceName) => void;
  onNavigate: (path: PageRoute) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  selectedServices,
  onToggleService,
  onNavigate,
}) => {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formattedMessage = useMemo(() => {
    const servicesList =
      selectedServices.length > 0 ? selectedServices.join(', ') : 'General Bridal Consultation';
    const dateLine = eventDate || 'Flexible / To be discussed';
    const nameLine = clientName.trim() || 'Prospective Client';
    const phoneLine = phoneNumber.trim() || 'Not provided';

    return [
      'Hello Suzan (NS Makeover),',
      '',
      'I would love to book an appointment. Here are my details:',
      `• Name: ${nameLine}`,
      `• Phone: ${phoneLine}`,
      `• Event Type: ${eventType}`,
      `• Event Date: ${dateLine}`,
      `• Services Interested In: ${servicesList}`,
      '',
      'Please share availability and package details. Thank you!',
    ].join('\n');
  }, [clientName, phoneNumber, eventDate, eventType, selectedServices]);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(formattedMessage), [formattedMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setCopied(false);

    if (!clientName.trim()) {
      setErrorMsg('Please enter your name so Suzan knows how to address you.');
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone or WhatsApp number.');
      return;
    }

    if (!eventDate) {
      setErrorMsg('Please select your preferred event date.');
      return;
    }

    if (selectedServices.length === 0) {
      setErrorMsg('Please select at least one service for your occasion.');
      return;
    }

    setSubmittedMessage(formattedMessage);

    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 sm:pt-36 sm:pb-28 text-[#FAF6F2]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#231919]/80 via-[#231919]/84 to-[#1B1313]/92"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] uppercase text-[#D8B491] hover:text-[#FAF6F2] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <p className="text-xs font-medium tracking-[0.28em] uppercase text-[#D8B491] mb-3">
            Private Reservations
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold text-[#FAF6F2] leading-[1.08]">
            Book Your Appointment{' '}
            <span className="font-script font-normal text-[1.22em] text-rose-gold-gradient inline-block pl-1">
              Today!
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-[15px] leading-[1.75] text-[#E6D9D1]/82">
            Reserve your wedding, engagement, reception, or party date directly with NS Makeover. Complete your details below to send a formatted WhatsApp booking message straight to Hema Suzan.
          </p>
        </motion.div>

        {/* Two-Column Luxury Booking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left: Direct Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-[26px] glass-espresso p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.24em] uppercase text-[#D8B491] mb-2">
                Direct Concierge Desk
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#FAF6F2] leading-tight">
                Speak Directly With Our Lead Artist
              </h2>
              <div className="h-[1px] w-16 my-6 bg-[#C59B76]/55" aria-hidden="true" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-[#C59B76]/40 bg-[#C59B76]/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#E6CEB5]" />
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-[#D8B491]/85 mb-1">
                      Contact Person
                    </p>
                    <p className="font-display text-2xl font-medium text-[#FAF6F2]">
                      {STUDIO_CONTACT.contactPerson}
                    </p>
                    <p className="text-xs text-[#E6D9D1]/70 mt-0.5">
                      Co-Founder &amp; Lead Bridal Makeover Artist
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-[#C59B76]/40 bg-[#C59B76]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#E6CEB5]" />
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-[#D8B491]/85 mb-1">
                      Phone &amp; WhatsApp
                    </p>
                    <a
                      href={STUDIO_CONTACT.phoneHref}
                      className="font-display text-2xl sm:text-[1.7rem] font-medium text-[#FAF6F2] hover:text-[#E6CEB5] transition-colors tabular-nums"
                    >
                      {STUDIO_CONTACT.phoneDisplay}
                    </a>
                    <p className="text-xs text-[#E6D9D1]/70 mt-0.5">
                      Direct inquiries for bridal dates, trials &amp; custom packages
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Call & WhatsApp Action Buttons */}
              <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <a
                  href={STUDIO_CONTACT.phoneHref}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] border border-[#C59B76]/50 hover:bg-[#C59B76]/15 transition-colors whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-[#E6CEB5]" />
                  <span>Call Now</span>
                </a>
                <a
                  href={buildWhatsAppUrl(
                    'Hello Suzan (NS Makeover), I would love to discuss availability and booking options.',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Suzan</span>
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#C59B76]/22">
              <p className="font-display italic text-lg text-[#E6CEB5]/90 leading-relaxed">
                “{STUDIO_CONTACT.quote}”
              </p>
              <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-[#D8B491]/75">
                {STUDIO_CONTACT.brandName} · {STUDIO_CONTACT.tagline}
              </p>
            </div>
          </motion.div>

          {/* Right: Interactive Appointment Form */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-[26px] glass-espresso p-8 sm:p-10"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="block text-xs font-medium tracking-[0.16em] uppercase text-[#D8B491] mb-2"
                  >
                    Client Name
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl bg-[#1D1414]/85 border border-[#C59B76]/30 px-4 py-3.5 text-sm text-[#FAF6F2] placeholder:text-[#E6D9D1]/40 focus:outline-none focus:border-[#E6CEB5] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs font-medium tracking-[0.16em] uppercase text-[#D8B491] mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl bg-[#1D1414]/85 border border-[#C59B76]/30 px-4 py-3.5 text-sm text-[#FAF6F2] placeholder:text-[#E6D9D1]/40 focus:outline-none focus:border-[#E6CEB5] transition-colors tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                <div>
                  <label
                    htmlFor="booking-date"
                    className="block text-xs font-medium tracking-[0.16em] uppercase text-[#D8B491] mb-2"
                  >
                    Event Date
                  </label>
                  <div className="relative">
                    <input
                      id="booking-date"
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl bg-[#1D1414]/85 border border-[#C59B76]/30 px-4 py-3.5 text-sm text-[#FAF6F2] focus:outline-none focus:border-[#E6CEB5] transition-colors [color-scheme:dark]"
                    />
                    <Calendar
                      aria-hidden="true"
                      className="pointer-events-none w-4 h-4 text-[#C59B76] absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hidden sm:block"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium tracking-[0.16em] uppercase text-[#D8B491] mb-2">
                    Event Type
                  </span>
                  <div role="radiogroup" aria-label="Event Type" className="grid grid-cols-2 gap-2">
                    {EVENT_TYPES.map((type) => {
                      const active = eventType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setEventType(type)}
                          className={`px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-[0.08em] transition-all cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#C59B76]/25 border border-[#E6CEB5] text-[#FAF6F2]'
                              : 'bg-[#1D1414]/70 border border-[#C59B76]/25 text-[#E6D9D1]/75 hover:border-[#C59B76]/55'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Multi-Select Services */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-medium tracking-[0.16em] uppercase text-[#D8B491]">
                    Select Services
                  </span>
                  <span className="text-[11px] text-[#E6D9D1]/70 tabular-nums">
                    {selectedServices.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICE_NAMES.map((service) => {
                    const checked = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => onToggleService(service)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs sm:text-[13px] transition-all cursor-pointer ${
                          checked
                            ? 'bg-[#9E5E63]/28 border border-[#E6CEB5]/70 text-[#FAF6F2]'
                            : 'bg-[#1D1414]/70 border border-[#C59B76]/24 text-[#E6D9D1]/80 hover:border-[#C59B76]/55'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                            checked
                              ? 'bg-[#C59B76] border-[#C59B76] text-[#231919]'
                              : 'border-[#C59B76]/50'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span className="leading-snug">{service}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorMsg && (
                <p
                  role="alert"
                  className="text-xs sm:text-sm text-[#F4B8BD] bg-[#9E5E63]/20 border border-[#9E5E63]/55 rounded-xl px-4 py-3"
                >
                  {errorMsg}
                </p>
              )}

              <div className="pt-2">
                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full text-xs sm:text-[13px] font-medium tracking-[0.16em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer shadow-[0_18px_40px_-14px_rgba(158,94,99,0.65)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6CEB5]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </motion.button>
              </div>
            </form>

            {/* Formatted Message Preview & Direct WhatsApp Trigger */}
            {submittedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border border-[#C59B76]/40 bg-[#1A1212]/90 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#E6CEB5]">
                    WhatsApp Message Ready for Suzan
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1.5 text-xs text-[#D8B491] hover:text-[#FAF6F2] transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E6CEB5] hover:underline"
                    >
                      <span>Open WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#E6D9D1]/85">
                  {submittedMessage}
                </pre>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
