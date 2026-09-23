import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink, AtSign, Share2, PlaySquare } from "lucide-react";
import ContactCard from "../components/ContactCard";
import { siteConfig } from "../config/site";

export default function Contact() {
  const socialLinks = [
    { key: "instagram", icon: AtSign, url: siteConfig.social.instagram },
    { key: "facebook", icon: Share2, url: siteConfig.social.facebook },
    { key: "youtube", icon: PlaySquare, url: siteConfig.social.youtube },
  ].filter((item) => item.url);

  return (
    <div>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
        <div className="container-page py-14 md:py-16">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-ink)]">
            Kontak
          </h1>
          <p className="mt-3 max-w-xl text-[var(--color-ink-soft)] leading-relaxed">
            Hubungi KUA Kecamatan Ngoro melalui salah satu kanal berikut.
          </p>
        </div>
      </section>

      <div className="container-page py-10 md:py-14 grid md:grid-cols-2 gap-8">
        <div className="grid sm:grid-cols-2 gap-4 content-start">
          <ContactCard icon={MapPin} label="Alamat" value={siteConfig.address} />
          <ContactCard
            icon={Phone}
            label="Telepon"
            value={siteConfig.phone}
            href={siteConfig.phone ? `tel:${siteConfig.phone}` : undefined}
          />
          <ContactCard
            icon={MessageCircle}
            label="WhatsApp"
            value={siteConfig.whatsapp}
            href={siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}` : undefined}
          />
          <ContactCard
            icon={Mail}
            label="Email"
            value={siteConfig.email}
            href={siteConfig.email ? `mailto:${siteConfig.email}` : undefined}
          />
          <ContactCard icon={Clock} label="Jam Layanan" value={siteConfig.officeHours} />

          {socialLinks.length > 0 && (
            <div className="col-span-full flex gap-3 mt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid place-items-center w-11 h-11 rounded-full bg-[var(--color-forest-tint)] text-[var(--color-forest)] hover:bg-[var(--color-forest)] hover:text-[var(--color-paper)] transition-colors"
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--color-paper-2)] border border-[var(--color-line)] rounded-xl p-6 flex flex-col items-start justify-center min-h-[240px]">
          <MapPin size={22} className="text-[var(--color-forest)]" />
          <p className="mt-3 font-display text-lg font-semibold text-[var(--color-ink)]">
            Lokasi Kantor
          </p>
          {siteConfig.mapsUrl ? (
            <a
              href={siteConfig.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-[var(--color-forest)] text-[var(--color-paper)] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--color-forest-2)]"
            >
              Buka di Google Maps
              <ExternalLink size={15} />
            </a>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] italic">
              Tautan peta resmi belum tersedia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
