import { defineField, defineType } from 'sanity';

// Nama ikon harus sama dengan yang didukung ServiceCard.tsx
const ICONS = ['HeartHandshake', 'Building2', 'Landmark', 'ShieldCheck', 'BookOpen', 'Users'];

export const layanan = defineType({
  name: 'layanan',
  title: 'Layanan',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nama Layanan', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 5, validation: (r) => r.required() }),
    defineField({ name: 'requirements', title: 'Persyaratan', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'procedure', title: 'Prosedur', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'estimated_time', title: 'Estimasi Waktu', type: 'string' }),
    defineField({ name: 'icon', title: 'Ikon', type: 'string', options: { list: ICONS } }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'inactive'], layout: 'radio' },
      initialValue: 'active',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 1, validation: (r) => r.required().integer().min(1) }),
  ],
  orderings: [{ title: 'Urutan', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
