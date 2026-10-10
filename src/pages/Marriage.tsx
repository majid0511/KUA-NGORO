// HALAMAN LAYANAN PERNIKAHAN (alamat: /layanan/pernikahan): panduan lengkap untuk calon pengantin—transparansi biaya nikah,
// checklist dokumen interaktif, alur 5 tahap, banner SIMKAH Online, dan FAQ. Seluruh data dari data/marriage.ts & data/faq.ts.
import { useState } from "react";
import { Heart, ShieldCheck, CheckCircle2, ExternalLink, DollarSign } from "lucide-react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Accordion } from "../components/ui/Accordion";
import { marriageSteps, documentChecklist, marriageFees } from "../data/marriage";
import { faqData } from "../data/faq";
import { ContactCtaSection } from "../components/sections/ContactCtaSection";
import { usePageMeta } from "../hooks/usePageMeta";

/**
 * Halaman panduan pernikahan.
 */
export default function Marriage() {
  usePageMeta({
    title: "Layanan Pernikahan",
    description:
      "Alur, dokumen persyaratan, dan biaya resmi pendaftaran nikah di KUA Kecamatan Ngoro.",
    path: "/layanan/pernikahan",
  });

  // Dokumen mana saja yang sudah dicentang pengunjung, mis. { N1: true }. Hanya di memori browser, tidak disimpan.
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Centang / hapus centang satu dokumen berdasarkan kodenya
  const toggleDoc = (code: string) => {
    setCheckedDocs((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Ambil kelompok FAQ "pernikahan" saja dari seluruh data FAQ (kosong jika tidak ada)
  const marriageFaqItems = faqData.find((f) => f.id === "pernikahan")?.items || [];

  return (
    <div className="py-10 space-y-16">
      {/* Kepala halaman */}
      <section className="bg-gradient-to-b from-amber-50/80 via-emerald-50/40 to-white py-12 border-b border-stone-200/60">
        <div className="container-kua">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-4 h-4 text-amber-700" />
              <span>PORTAL CALON PENGANTIN</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Panduan Layanan Pernikahan
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
              Panduan lengkap pendaftaran nikah online, persyaratan dokumen, transparansi biaya resmi, serta alur pendaftaran akad nikah di KUA Kecamatan Ngoro.
            </p>
          </div>
        </div>
      </section>

      {/* Bagian 1: Transparansi biaya nikah (dua kartu) */}
      <section className="container-kua">
        <SectionHeading
          eyebrow="REGULASI PP NO 59/2018"
          title="Transparansi Biaya Nikah"
          description="Ketentuan biaya resmi negara tanpa pungli dan bebas dari biaya tambahan apapun."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kartu 1: nikah di Balai KUA = gratis */}
          <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-emerald-100 text-xs font-bold uppercase">
                  Di Balai Nikah KUA
                </span>
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-mono">
                {marriageFees.inOffice.amount}
              </h3>

              <p className="text-sm text-emerald-100 mt-2 font-semibold">
                {marriageFees.inOffice.location} • {marriageFees.inOffice.schedule}
              </p>

              <p className="text-xs text-emerald-200/80 mt-4 leading-relaxed">
                {marriageFees.inOffice.note}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800 text-xs text-emerald-300">
              ✓ Berlaku pada hari & jam kerja resmi KUA
            </div>
          </div>

          {/* Kartu 2: nikah di luar KUA ("bedol") = biaya resmi PNBP */}
          <div className="bg-white border-2 border-amber-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase">
                  Luar KUA / Bedol
                </span>
                <DollarSign className="w-6 h-6 text-amber-700" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-amber-800 font-mono">
                {marriageFees.outOffice.amount}
              </h3>

              <p className="text-sm text-stone-800 mt-2 font-semibold">
                {marriageFees.outOffice.location}
              </p>

              <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                {marriageFees.outOffice.note}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-amber-800 font-semibold">
               Disetor langsung ke rekening Kas Negara via Bank / E-Banking (PNBP)
            </div>
          </div>
        </div>
      </section>

      {/* Bagian 2: Checklist dokumen yang bisa dicentang pengunjung */}
      <section className="bg-stone-50/80 py-16 border-y border-stone-200/60">
        <div className="container-kua">
          <SectionHeading
            eyebrow="CHECKLIST MANDIRI"
            title="Kelengkapan Dokumen Persyaratan"
            description="Tandai dokumen yang sudah Anda miliki sebelum menyerahkan berkas fisik ke KUA Ngoro."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documentChecklist.map((doc) => {
              const isChecked = !!checkedDocs[doc.code];
              return (
                <div
                  key={doc.code}
                  onClick={() => toggleDoc(doc.code)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isChecked
                      ? "bg-emerald-50 border-emerald-500 shadow-sm"
                      : "bg-white border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
                        {doc.code}
                      </span>

                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                          isChecked
                            ? "bg-[#0f5132] border-[#0f5132] text-white"
                            : "border-stone-300 bg-stone-50"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 mb-1">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-stone-500 font-medium mb-2">
                      Diterbitkan: {doc.issuedBy}
                    </p>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-stone-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    {doc.requiredFor}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bagian 3: Alur 5 tahap pendaftaran nikah */}
      <section className="container-kua">
        <SectionHeading
          eyebrow="TAHAPAN LENGKAP"
          title="Alur Pelayanan Nikah di KUA Ngoro"
          description="Lima tahapan utama pendaftaran nikah dari persiapan hingga penerbitan Buku Nikah."
        />

        <div className="space-y-6">
          {marriageSteps.map((step) => (
            <div
              key={step.step}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#0f5132] text-white flex items-center justify-center font-mono font-bold text-lg shrink-0">
                {step.step}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-lg font-bold text-stone-900">{step.title}</h3>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                    {step.subtitle}
                  </span>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">
                  {step.description}
                </p>

                <ul className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {step.details.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <span className="text-[#0f5132] font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian 4: Banner ajakan mendaftar lewat SIMKAH Online */}
      <section className="container-kua">
        <div className="bg-gradient-to-r from-emerald-900 to-[#0f5132] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              DAFTAR NIKAH ONLINE
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Siap Mendaftar Nikah via SIMKAH 4.0?
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Calon pengantin dapat langsung membuat akun dan mendaftar nikah online kapan saja melalui situs resmi SIMKAH Kemenag RI.
            </p>
          </div>

          <a
            href="https://simkah4.kemenag.go.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-7 py-3.5 rounded-xl text-base transition shadow-md shrink-0"
          >
            <span>Buka SIMKAH Online</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Bagian 5: FAQ pernikahan (akordeon) */}
      <section className="container-kua">
        <SectionHeading
          eyebrow="TANYA JAWAB"
          title="Pertanyaan Sering Diajukan (FAQ)"
          description="Jawaban resmi seputar prosedur nikah, dispensasi, dan regulasi KUA."
        />

        <div className="max-w-4xl mx-auto">
          <Accordion
            items={marriageFaqItems.map((item, idx) => ({
              id: `faq-m-${idx}`,
              title: item.question,
              content: item.answer,
            }))}
          />
        </div>
      </section>

      <ContactCtaSection />
    </div>
  );
}
