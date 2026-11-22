import React from 'react';
import { MessageCircle, Phone, RefreshCw } from 'lucide-react';
import { buildWhatsAppUrl, STUDIO_CONTACT } from '../data/studioContent';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[NS Makeover Render Error]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF6F2] text-[#231919] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full rounded-[26px] border border-[#C59B76]/45 bg-white/95 p-8 sm:p-10 text-center shadow-xl">
            <p className="text-xs font-medium tracking-[0.28em] uppercase text-[#8E5358] mb-3">
              {STUDIO_CONTACT.tagline}
            </p>
            <h1 className="font-display text-4xl font-semibold text-[#231919]">
              NS MAKEOVER
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#4C3939]">
              We encountered a brief display issue while loading the studio experience. Please refresh the page or reach Hema Suzan directly.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-[#231919] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Studio</span>
              </button>

              <a
                href={buildWhatsAppUrl('Hello Suzan (NS Makeover), I would like to book an appointment.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-[0.14em] uppercase text-[#FAF6F2] bg-rose-gold-shimmer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Suzan</span>
              </a>
            </div>

            <a
              href={STUDIO_CONTACT.phoneHref}
              className="mt-5 inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#8E5358] hover:text-[#231919]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{STUDIO_CONTACT.phoneDisplay}</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
