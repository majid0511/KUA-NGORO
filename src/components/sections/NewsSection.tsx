import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { NewsCard } from "../cards/NewsCard";
import { newsData } from "../../data/news";

export const NewsSection: React.FC = () => {
  const latestNews = newsData.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-stone-50/70 border-b border-stone-200/60">
      <div className="container-kua">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6">
          <SectionHeading
            eyebrow="PUSAT INFORMASI"
            title="Informasi Terbaru KUA Ngoro"
            description="Pengumuman resmi, berita kegiatan, dan artikel edukasi seputar layanan keagamaan."
            className="mb-0"
          />

          <Link
            to="/informasi"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5132] hover:text-[#073822] shrink-0 hover:underline"
          >
            <span>Arsip Informasi Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {latestNews.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              excerpt={item.excerpt}
              category={item.category}
              date={item.date}
              author={item.author}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
