import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import heroImage from "../assets/hero.png";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-[var(--color-line)] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay gradasi transparan agar foto KUA terlihat dan teks tetap terbaca */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-forest)]/85 via-[var(--color-forest)]/50 to-[var(--color-forest)]/10"
        aria-hidden="true"
      />

      <div className="relative container-page grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium text-[var(--color-paper)] bg-[var(--color-forest)]/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
            <Compass size={14} />
            Kecamatan Ngoro, Kabupaten Jombang
          </p>

          <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] text-[var(--color-paper)] max-w-xl">
            Layanan KUA Ngoro, kini lebih mudah diakses.
          </h1>

          <p className="mt-5 text-base md:text-lg text-[var(--color-paper)]/85 max-w-md leading-relaxed">
            Temukan informasi seputar KUA Kecamatan Ngoro dan akses layanan resmi
            urusan agama dari satu portal yang mudah digunakan.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-[var(--color-paper)] text-[var(--color-forest)] px-5 py-3 rounded-lg text-sm font-semibold hover:bg-white transition-colors"
            >
              Jelajahi Layanan
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 border border-white/40 px-5 py-3 rounded-lg text-sm font-semibold text-[var(--color-paper)] hover:border-white hover:bg-white/10 transition-colors"
            >
              Kenali KUA Ngoro
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-[var(--color-paper)]/80 hover:text-white transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}