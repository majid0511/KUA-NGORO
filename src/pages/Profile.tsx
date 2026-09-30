import { useState, useEffect } from "react";
import { Landmark, Shield, Target, MapPin, CheckCircle } from "lucide-react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaffCard } from "../components/cards/StaffCard";
import { getProfil, getStaf } from "../lib/cms";
import type { Profil, Staf } from "../lib/cms/types";
import { LoadingState, ErrorState } from "../components/ui/CmsState";
import { profileData } from "../data/profile";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Profile() {
  usePageMeta({
    title: "Profil KUA",
    description:
      "Sejarah, visi misi, wilayah kerja, dan susunan staf Kantor Urusan Agama Kecamatan Ngoro, Kabupaten Jombang.",
    path: "/profil",
  });

  const [profil, setProfil] = useState<Profil | null>(null);
  const [stafList, setStafList] = useState<Staf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [profilRes, stafRes] = await Promise.all([
          getProfil(),
          getStaf(),
        ]);
        if (profilRes.data) setProfil(profilRes.data);
        if (stafRes.data) setStafList(stafRes.data);
      } catch (_err) {
        setError("Profil belum dapat dimuat. Silakan coba kembali.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const displayProfil = profil || {
    office_name: profileData.name,
    description: profileData.aboutFull,
    history: profileData.history,
    vision: profileData.vision,
    mission: profileData.missions,
    address: profileData.address,
    phone: profileData.phone,
    email: profileData.email,
    office_hours: profileData.officeHours,
  };

  return (
    <div className="py-10 space-y-16">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0f5132] text-xs font-bold uppercase tracking-wider mb-4">
              <Landmark className="w-4 h-4" />
              <span>PROFIL KELEMBAGAAN</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Profil {displayProfil.office_name}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Mengenal lebih dekat sejarah, visi & misi, tugas fungsi, serta struktur organisasi Kantor Urusan Agama Kecamatan Ngoro, Kabupaten Jombang.
            </p>
          </div>
        </div>
      </section>

      {loading && <LoadingState message="Memuat profil KUA..." />}
      {error && <ErrorState message={error} />}

      {/* Tentang & Sejarah */}
      <section className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              eyebrow="GAMBARAN UMUM"
              title={`Tentang & Sejarah ${displayProfil.office_name}`}
              className="mb-4"
            />
            <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
              {displayProfil.description}
            </p>
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-stone-800 space-y-3">
              <h4 className="font-bold text-[#0f5132] text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-700" />
                <span>Transformasi Digital & Transparansi Layanan</span>
              </h4>
              <p className="text-sm leading-relaxed text-stone-700">
                {displayProfil.history}
              </p>
            </div>
          </div>

          {/* Wilayah Kerja 13 Desa Card */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <MapPin className="w-5 h-5 text-[#0f5132]" />
              <span>Wilayah Kerja 13 Desa</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              KUA Kecamatan Ngoro melayani seluruh kebutuhan administrasi keagamaan warga di 13 desa:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {profileData.villages.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-800"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0f5132]" />
                  <span>Desa {v.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-stone-50/80 py-16 border-y border-stone-200/60">
        <div className="container-kua space-y-10">
          <SectionHeading
            eyebrow="PEDOMAN KERJA"
            title={`Visi & Misi ${displayProfil.office_name}`}
            centered
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visi Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#042918] to-[#0f5132] text-white p-8 rounded-3xl shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-2">
                  VISI RESMI
                </span>
                <p className="text-lg sm:text-xl font-bold leading-relaxed text-emerald-50">
                  "{displayProfil.vision}"
                </p>
              </div>

              <div className="pt-8 border-t border-emerald-800 text-xs text-emerald-300 font-medium">
                {displayProfil.office_name} • Kabupaten Jombang
              </div>
            </div>

            {/* Misi List */}
            <div className="lg:col-span-7 bg-white border border-stone-200 p-8 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100">
                Misi Utama Pelayanan:
              </h3>
              <div className="space-y-3.5">
                {Array.isArray(displayProfil.mission) &&
                  displayProfil.mission.map((misi, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-[#0f5132] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium">
                        {misi}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tugas dan Fungsi */}
      <section className="container-kua">
        <SectionHeading
          eyebrow="TUGAS WENANG"
          title="Tugas & Fungsi KUA Ngoro"
          description="Berdasarkan regulasi resmi Kementerian Agama RI dalam melayani urusan keagamaan di tingkat kecamatan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.duties.map((duty) => (
            <div
              key={duty.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f5132] flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">{duty.title}</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {duty.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Staff Members Section from CMS */}
      <section className="container-kua">
        <SectionHeading
          eyebrow="SUMBER DAYA MANUSIA"
          title="Pegawai & Petugas Pelayanan"
          description="Daftar pejabat fungsional, penghulu, penyuluh agama Islam, dan staf pelaksana KUA Ngoro."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stafList.map((staf) => (
            <StaffCard
              key={staf.id}
              name={staf.name}
              position={staf.position}
              roleCategory={staf.position.includes("Kepala") ? "Kepala" : staf.position.includes("Penghulu") ? "Penghulu" : "Staf"}
              description={staf.bio}
              photoUrl={staf.photo}
            />
          ))}
        </div>
      </section>

      <ContactCtaSection />
    </div>
  );
}
