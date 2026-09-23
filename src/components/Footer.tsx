import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import { services } from "../config/services";

export default function Footer() {
  const featuredServices = services.slice(0, 4);

  return (
    <footer className="bg-[var(--color-forest)] text-[var(--color-paper)]">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-[var(--color-paper)]/75 leading-relaxed">
            Kabupaten {siteConfig.regency}
            <br />
            {siteConfig.province}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-paper)]/60">
            Navigasi
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:underline" to="/">Beranda</Link></li>
            <li><Link className="hover:underline" to="/profile">Profil</Link></li>
            <li><Link className="hover:underline" to="/services">Layanan</Link></li>
            <li><Link className="hover:underline" to="/information">Informasi</Link></li>
            <li><Link className="hover:underline" to="/contact">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-paper)]/60">
            Layanan
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {featuredServices.map((service) => (
              <li key={service.id}>
                <Link className="hover:underline" to="/services">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-paper)]/60">
            Kontak
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-paper)]/85">
            <li>{siteConfig.address || "Alamat belum tersedia"}</li>
            <li>{siteConfig.phone || "Telepon belum tersedia"}</li>
            <li>{siteConfig.email || "Email belum tersedia"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-paper)]/15">
        <div className="container-page py-5 text-xs text-[var(--color-paper)]/65 flex flex-col md:flex-row md:justify-between gap-2">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}.
            {siteConfig.isOfficiallyConfirmed ? " Situs resmi." : " Seluruh hak dilindungi."}
          </p>
          <p>{siteConfig.ministry}</p>
        </div>
      </div>
    </footer>
  );
}
