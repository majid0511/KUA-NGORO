import ProfileSection from "../components/ProfileSection";
import DutyCard from "../components/DutyCard";
import VisionMission from "../components/VisionMission";
import ServiceArea from "../components/ServiceArea";
import OrganizationChart from "../components/OrganizationChart";
import StaffCard from "../components/StaffCard";
import ActivityCard from "../components/ActivityCard";
import Gallery from "../components/Gallery";
import EmptyState from "../components/EmptyState";
import { profileConfig } from "../config/profile";

const anchors = [
  { id: "identitas", label: "Identitas" },
  { id: "tentang", label: "Tentang" },
  { id: "tugas-fungsi", label: "Tugas & Fungsi" },
  { id: "visi-misi", label: "Visi & Misi" },
  { id: "wilayah-kerja", label: "Wilayah Kerja" },
  { id: "struktur", label: "Struktur" },
  { id: "pegawai", label: "Pegawai" },
  { id: "kegiatan", label: "Kegiatan" },
  { id: "galeri", label: "Galeri" },
];

export default function Profile() {
  const { identity } = profileConfig;

  return (
    <div>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-paper-2)]">
        <div className="container-page py-14 md:py-16">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-ink)]">
            Profil KUA Ngoro
          </h1>
          <p className="mt-3 max-w-xl text-[var(--color-ink-soft)] leading-relaxed">
            Kenali lembaga, tugas dan tanggung jawab, wilayah kerja, pegawai, serta kegiatan
            KUA Kecamatan Ngoro.
          </p>
        </div>
      </section>

      <nav
        aria-label="Navigasi profil"
        className="sticky top-16 z-40 bg-[var(--color-paper)]/95 backdrop-blur border-b border-[var(--color-line)] overflow-x-auto"
      >
        <div className="container-page flex gap-5 py-3 text-sm whitespace-nowrap">
          {anchors.map((anchor) => (
            <a
              key={anchor.id}
              href={`#${anchor.id}`}
              className="text-[var(--color-ink-soft)] hover:text-[var(--color-forest)] font-medium"
            >
              {anchor.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container-page">
        <ProfileSection id="identitas" title="Identitas Kelembagaan">
          <dl className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            <Item label="Nama Resmi" value={identity.officialName} />
            <Item label="Kecamatan" value={identity.district} />
            <Item label="Kabupaten" value={identity.regency} />
            <Item label="Provinsi" value={identity.province} />
            <Item label="Kementerian" value={identity.ministry} />
          </dl>
        </ProfileSection>

        <ProfileSection id="tentang" title="Tentang KUA Ngoro">
          <p className="max-w-3xl text-[var(--color-ink)] leading-relaxed">
            {profileConfig.aboutFull}
          </p>
        </ProfileSection>

        <ProfileSection id="tugas-fungsi" title="Tugas dan Fungsi">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profileConfig.duties.map((duty) => (
              <DutyCard key={duty.id} duty={duty} />
            ))}
          </div>
        </ProfileSection>

        <ProfileSection id="visi-misi" title="Visi dan Misi">
          <VisionMission vision={profileConfig.vision} missions={profileConfig.missions} />
        </ProfileSection>

        <ProfileSection id="wilayah-kerja" title="Wilayah Kerja">
          <ServiceArea villages={profileConfig.serviceArea} />
        </ProfileSection>

        <ProfileSection id="struktur" title="Struktur Organisasi">
          <OrganizationChart root={profileConfig.organizationalStructure} />
        </ProfileSection>

        <ProfileSection id="pegawai" title="Pegawai KUA">
          {profileConfig.staff.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {profileConfig.staff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          ) : (
            <EmptyState message="Data pegawai resmi belum tersedia dan akan ditambahkan setelah terverifikasi." />
          )}
        </ProfileSection>

        <ProfileSection id="kegiatan" title="Kegiatan dan Program">
          {profileConfig.activities.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {profileConfig.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState message="Informasi kegiatan resmi akan ditambahkan setelah data terverifikasi tersedia." />
          )}
        </ProfileSection>

        <ProfileSection id="galeri" title="Galeri Kegiatan">
          <Gallery items={profileConfig.gallery} />
        </ProfileSection>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--color-line)] pb-3">
      <dt className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{label}</dt>
      <dd className="mt-1 text-[var(--color-ink)] font-medium">{value}</dd>
    </div>
  );
}
