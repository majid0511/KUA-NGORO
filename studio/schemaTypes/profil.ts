import { defineField, defineType } from 'sanity';

// Singleton: hanya satu dokumen (id "profil"), lihat sanity.config.ts
export const profil = defineType({
  name: 'profil',
  title: 'Profil KUA',
  type: 'document',
  fields: [
    defineField({ name: 'office_name', title: 'Nama Kantor', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Tentang', type: 'text', rows: 5 }),
    defineField({ name: 'history', title: 'Sejarah', type: 'text', rows: 6 }),
    defineField({ name: 'vision', title: 'Visi', type: 'text', rows: 3 }),
    defineField({ name: 'mission', title: 'Misi', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'address', title: 'Alamat', type: 'text', rows: 3 }),
    defineField({ name: 'phone', title: 'Telepon', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.email() }),
    defineField({
      name: 'office_hours',
      title: 'Jam Layanan',
      type: 'object',
      fields: [
        defineField({ name: 'workDays', title: 'Senin - Kamis', type: 'string' }),
        defineField({ name: 'fridayHours', title: 'Jumat', type: 'string' }),
        defineField({ name: 'weekend', title: 'Sabtu - Minggu', type: 'string' }),
      ],
    }),
  ],
  preview: { select: { title: 'office_name' } },
});
