import { defineField, defineType } from 'sanity';

export const pengumuman = defineType({
  name: 'pengumuman',
  title: 'Pengumuman',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Judul', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'content', title: 'Isi', type: 'text', rows: 8, validation: (r) => r.required() }),
    defineField({ name: 'published_at', title: 'Tanggal Terbit', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: 'expires_at', title: 'Berlaku Sampai (opsional)', type: 'datetime' }),
    defineField({
      name: 'priority',
      title: 'Prioritas',
      type: 'string',
      options: { list: ['normal', 'important'], layout: 'radio' },
      initialValue: 'normal',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'published'], layout: 'radio' },
      initialValue: 'draft',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
