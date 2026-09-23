import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { profileConfig } from "../config/profile";

export default function AboutPreview() {
  return (
    <section className="container-page py-16 md:py-20">
      <div className="grid md:grid-cols-3 gap-10 items-start">
        <SectionHeading title="Tentang KUA Ngoro" />
        <div className="md:col-span-2">
          <p className="text-[var(--color-ink-soft)] text-base md:text-lg leading-relaxed">
            {profileConfig.aboutShort}
          </p>
          <Link
            to="/profile"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-forest)] hover:text-[var(--color-forest-2)]"
          >
            Baca Profil Lengkap
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
