import { defineField, defineType } from 'sanity';

export const berita = defineType({
  name: 'berita',
  title: 'Berita',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Judul', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Ringkasan', type: 'text', rows: 3, validation: (r) => r.required().max(300) }),
    defineField({ name: 'content', title: 'Isi', type: 'text', rows: 12, validation: (r) => r.required() }),
    defineField({ name: 'featured_image', title: 'Gambar Utama', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: { list: ['Pengumuman', 'Berita', 'Artikel'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'author', title: 'Penulis', type: 'string', initialValue: 'Tim Humas KUA Ngoro' }),
    defineField({ name: 'published_at', title: 'Tanggal Terbit', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'published'], layout: 'radio' },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: 'Terbaru', name: 'publishedDesc', by: [{ field: 'published_at', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'status', media: 'featured_image' } },
});
