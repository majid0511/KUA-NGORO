import { Landmark, Shield, Target, MapPin, CheckCircle } from "lucide-react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { StaffCard } from "../components/cards/StaffCard";
import { profileData } from "../data/profile";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";

export default function Profile() {
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
              Profil KUA Kecamatan Ngoro
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Mengenal lebih dekat sejarah, visi & misi, tugas fungsi, serta struktur organisasi Kantor Urusan Agama Kecamatan Ngoro, Kabupaten Jombang.
            </p>
          </div>
        </div>
      </section>

      {/* Tentang & Sejarah */}
      <section className="container-kua">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              eyebrow="GAMBARAN UMUM"
              title="Tentang & Sejarah KUA Ngoro"
              className="mb-4"
            />
            <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
              {profileData.aboutFull}
            </p>
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-stone-800 space-y-3">
              <h4 className="font-bold text-[#0f5132] text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-700" />
                <span>Transformasi Digital & Transparansi Layanan</span>
              </h4>
              <p className="text-sm leading-relaxed text-stone-700">
                {profileData.history}
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
            title="Visi & Misi KUA Kecamatan Ngoro"
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
                  "{profileData.vision}"
                </p>
              </div>

              <div className="pt-8 border-t border-emerald-800 text-xs text-emerald-300 font-medium">
                KUA Kecamatan Ngoro • Kabupaten Jombang
              </div>
            </div>

            {/* Misi List */}
            <div className="lg:col-span-7 bg-white border border-stone-200 p-8 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100">
                Misi Utama Pelayanan:
              </h3>
              <div className="space-y-3.5">
                {profileData.missions.map((misi, idx) => (
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

      {/* Struktur Organisasi Visual */}
      <section className="bg-stone-50/80 py-16 border-y border-stone-200/60">
        <div className="container-kua">
          <SectionHeading
            eyebrow="BAGAN ORGANISASI"
            title="Struktur Organisasi KUA Ngoro"
            description="Visual hierarki kepemimpinan dan pembagian fungsi kerja pelayanan."
          />

          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            {/* Top Node: Kepala KUA */}
            <div className="max-w-sm mx-auto text-center p-5 rounded-2xl bg-[#0f5132] text-white shadow-md mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block mb-1">
                {profileData.orgChart.title}
              </span>
              <h3 className="text-xl font-extrabold">{profileData.orgChart.name}</h3>
            </div>

            <div className="w-0.5 h-8 bg-emerald-700 mx-auto mb-8" />

            {/* Sub Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profileData.orgChart.children?.map((child) => (
                <div
                  key={child.id}
                  className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 text-center space-y-2"
                >
                  <span className="text-xs font-bold text-[#0f5132] uppercase tracking-wider block">
                    {child.title}
                  </span>
                  <h4 className="text-base font-bold text-stone-900">{child.name}</h4>
                  {child.children && (
                    <div className="pt-2 border-t border-emerald-200/60 text-xs text-stone-600 font-medium">
                      {child.children.map((sub) => sub.title).join(" • ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staff Members Section */}
      <section className="container-kua">
        <SectionHeading
          eyebrow="SUMBER DAYA MANUSIA"
          title="Pegawai & Petugas Pelayanan"
          description="Daftar pejabat fungsional, penghulu, penyuluh agama Islam, dan staf pelaksana KUA Ngoro."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profileData.staff.map((staf) => (
            <StaffCard
              key={staf.id}
              name={staf.name}
              position={staf.position}
              nip={staf.nip}
              roleCategory={staf.roleCategory}
              description={staf.description}
              photoUrl={staf.photoUrl}
            />
          ))}
        </div>
      </section>

      <ContactCtaSection />
    </div>
  );
}
