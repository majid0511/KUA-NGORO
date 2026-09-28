import { defineField, defineType } from 'sanity';

export const staf = defineType({
  name: 'staf',
  title: 'Staf',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nama', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'position', title: 'Jabatan', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Keterangan', type: 'text', rows: 3 }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 1, validation: (r) => r.required().integer().min(1) }),
    defineField({ name: 'active', title: 'Tampilkan di website', type: 'boolean', initialValue: true }),
  ],
  orderings: [{ title: 'Urutan', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'position', media: 'photo' } },
});
