import { defineField, defineType } from 'sanity';

export const galeri = defineType({
  name: 'galeri',
  title: 'Galeri Kegiatan',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Judul', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Gambar', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 3 }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: { list: ['Kegiatan', 'Pelayanan', 'Acara', 'Lainnya'] },
      initialValue: 'Kegiatan',
    }),
    defineField({ name: 'published_at', title: 'Tanggal', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
  ],
  orderings: [{ title: 'Terbaru', name: 'publishedDesc', by: [{ field: 'published_at', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } },
});
