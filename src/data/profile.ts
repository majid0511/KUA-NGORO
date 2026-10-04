export interface Duty {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Village {
  id: string;
  name: string;
  code?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  nip?: string;
  roleCategory: 'Kepala' | 'Penghulu' | 'Penyuluh' | 'Pelaksana' | 'Staf';
  description?: string;
  photoUrl?: string;
}

export interface ProfileData {
  name: string;
  ministry: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: {
    workDays: string;
    fridayHours: string;
    weekend: string;
  };
  mapsUrl: string;
  aboutShort: string;
  aboutFull: string;
  history: string;
  vision: string;
  missions: string[];
  duties: Duty[];
  villages: Village[];
  staff: StaffMember[];
}

export const profileData: ProfileData = {
  name: "KUA Kecamatan Ngoro",
  ministry: "Kementerian Agama Republik Indonesia",
  
  address: "Jl. Arjuno No.7, Pandean, Ngoro, Kec. Ngoro, Kabupaten Jombang, Jawa Timur 61473",
  phone: "0851-3322-5303",
  whatsapp: "6285133225303",
  email: "kua.ngoro.jombang@kemenag.go.id", // TODO: Replace with verified KUA email if changed
  
  officeHours: {
    workDays: "Senin - Kamis: 07.30 - 16.00 WIB",
    fridayHours: "Jumat: 07.30 - 16.30 WIB",
    weekend: "Sabtu - Minggu & Hari Libur Nasional: Tutup",
  },

  mapsUrl: "https://www.google.com/maps/place/KUA+Kecamatan+Ngoro/@-7.6925264,112.2692273,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7868772497aa05:0x2fe556b013739c7f!8m2!3d-7.6925264!4d112.2718022",

  aboutShort: "KUA Kecamatan Ngoro adalah unit pelaksana teknis Kementerian Agama di tingkat kecamatan yang bertugas memberikan pelayanan, pencatatan nikah dan rujuk, serta pembinaan kehidupan keagamaan bagi masyarakat Ngoro, Kabupaten Jombang.",

  aboutFull: "Kantor Urusan Agama (KUA) Kecamatan Ngoro bertindak sebagai garis depan pelayanan keagamaan Kementerian Agama Republik Indonesia di wilayah Kecamatan Ngoro, Kabupaten Jombang. Berkomitmen menghadirkan layanan publik yang transparan, profesional, ramah, dan inklusif, KUA Ngoro melayani urusan pernikahan, konsultasi keluarga sakinah, pengurusan sertifikasi tanah wakaf, pembinaan kemasjidan, hingga bimbingan penyuluhan agama Islam bagi seluruh lapisan masyarakat di 13 desa se-Kecamatan Ngoro.",

  history: "Sebagai lembaga keagamaan resmi tingkat kecamatan di bawah Naungan Kantor Kementerian Agama Kabupaten Jombang, KUA Kecamatan Ngoro telah berdiri dan bertransformasi seiring perkembangan jaman. Dalam beberapa tahun terakhir, KUA Ngoro secara konsisten melakukan digitalisasi layanan publik, mempermudah pendaftaran nikah secara online melalui SIMKAH, melayani konsultasi langsung maupun via WhatsApp, serta memperkuat pembinaan kerukunan umat beragama di wilayah Kecamatan Ngoro.",

  vision: "Terwujudnya Pelayanan Kantor Urusan Agama Kecamatan Ngoro yang Profesional, Transparan, dan Berintegritas dalam Membangun Masyarakat Kecamatan Ngoro yang Religius, Rukun, Moderat, serta Berakhlakul Karimah.",

  missions: [
    "Meningkatkan kualitas pelayanan administrasi nikah dan rujuk yang cepat, akurat, tertib hukum, dan sesuai dengan regulasi perundang-undangan.",
    "Menguatkan pelayanan bimbingan dan ketahanan keluarga melalui program Bimbingan Perkawinan (Bimwin) menuju keluarga sakinah, mawaddah, wa rahmah.",
    "Mengarusutaman dan menguatkan Moderasi Beragama serta memelihara kerukunan umat beragama di wilayah Kecamatan Ngoro.",
    "Meningkatkan tata kelola, pembinaan, dan pemberdayaan di bidang kemasjidan, zakat, wakaf, serta ibadah sosial secara akuntabel.",
    "Meningkatkan kualitas bimbingan, penyuluhan, dan penerangan agama Islam secara edukatif, inovatif, dan berkelanjutan.",
    "Mengoptimalkan pelayanan manasik, bimbingan, dan penyajian data informasi penyelenggaraan ibadah haji dan umrah.",
    "Mempercepat transformasi digital (digitalisasi layanan), akurasi tata kelola administrasi perkantoran, dan peningkatan kompetensi SDM.",
    "Membangun kemitraan dan kerja sama lintas sektor dengan pemerintah daerah, institusi pendidikan, organisasi kemasyarakatan Islam, dan pemangku kepentingan terkait."
    
  ],

  duties: [
    {
      id: "nikah",
      title: "Pencatatan Nikah & Rujuk",
      description: "Melayani pendaftaran, verifikasi administrasi (pemeriksaan), dan pelaksanaan akad nikah resmi tercatat di SIMKAH.",
      iconName: "HeartHandshake"
    },
    {
      id: "bimbingan",
      title: "Bimbingan Perkawinan (Bimwin)",
      description: "Memberikan pembekalan psikologis, agama, kesehatan reproduksi, dan manajemen keluarga bagi calon pengantin.",
      iconName: "Users"
    },
    {
      id: "wakaf",
      title: "Pelayanan Sertifikasi Wakaf",
      description: "Penerbitan Akta Ikrar Wakaf (AIW) dan Akta Pengganti Akta Ikrar Wakaf (APAIW) serta pendataan tanah wakaf.",
      iconName: "Landmark"
    },
    {
      id: "masjid",
      title: "Kemakmuran Kemasjidan & Musala",
      description: "Pendataan ID Masjid/Musala di SIMAS, pendaftaran arah kiblat, dan pembinaan pengurus takmir.",
      iconName: "Building2"
    },
    {
      id: "keluarga",
      title: "Konsultasi BP4 & Keluarga Sakinah",
      description: "Layanan konseling rumah tangga, pencegahan perceraian, serta bimbingan keluarga sakinah.",
      iconName: "ShieldCheck"
    },
    {
      id: "penyuluhan",
      title: "Bimbingan & Penyuluhan Agama",
      description: "Pembinaan kelompok majelis taklim, pembacaan doa keagamaan, serta sosialisasi kebijakan Kemenag.",
      iconName: "BookOpen"
    }
  ],

  // 13 Desa di Kecamatan Ngoro, Kabupaten Jombang
  villages: [
    { id: "1", name: "Ngoro", code: "35.17.03.2001" },
    { id: "2", name: "Pulorejo", code: "35.17.03.2002" },
    { id: "3", name: "Japanan", code: "35.17.03.2003" },
    { id: "4", name: "Badang", code: "35.17.03.2004" },
    { id: "5", name: "Banyuarang", code: "35.17.03.2005" },
    { id: "6", name: "Gajah", code: "35.17.03.2006" },
    { id: "7", name: "Genukwatu", code: "35.17.03.2007" },
    { id: "8", name: "Jarak", code: "35.17.03.2008" },
    { id: "9", name: "Kauman", code: "35.17.03.2009" },
    { id: "10", name: "Kertorejo", code: "35.17.03.2010" },
    { id: "11", name: "Kesamben", code: "35.17.03.2011" },
    { id: "12", name: "Rejosopinggir", code: "35.17.03.2012" },
    { id: "13", name: "Sidowarek", code: "35.17.03.2013" }
  ],

  staff: [
    {
      id: "staf-1",
      name: "Achmad Cholili, S.Ag., M.H.I.", // TODO: Replace with verified KUA data (Nama Kepala KUA)
      position: "Kepala KUA Kecamatan Ngoro",
      roleCategory: "Kepala",
      description: "Memimpin pelaksanaan tugas dan fungsi KUA Kecamatan Ngoro sesuai petunjuk teknis Kementerian Agama.",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "staf-2",
      name: "Purwaning Rohmah", // TODO: Replace with verified KUA data
      position: "Pengolah Data dan Informasi",
      roleCategory: "Pelaksana",
      description: "Melakukan tugas pelayanan dan pengawasan nikah / rujuk serta bimbingan keluarga sakinah.",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "staf-3",
      name: "Moh. Hadi Ismanto, S.H.I.", // TODO: Replace with verified KUA data
      position: "Penghulu Ahli Pertama",
      roleCategory: "Penghulu",
      description: "Melaksanakan bimbingan keagamaan Islam, penyuluhan produk halal, dan fasilitasi majelis taklim di desa.",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "staf-4",
      name: "Moh. Maslihan, S.Pd.I.", // TODO: Replace with verified KUA data
      position: "Penyuluh Agama Islam Ahli Pertama",
      roleCategory: "Penyuluh",
      description: "Mengelola administrasi surat menyurat, validasi data pendaftaran nikah online, dan pelayanan front office.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "staf-5",
      name: "Rohmatulloh, S.Pd.I", // TODO: Replace with verified KUA data
      position: "Penata Layanan Operasional",
      roleCategory: "Pelaksana",
      description: "Memberikan bimbingan dan penyuluhan agama Islam di masyarakat, termasuk pembinaan majelis taklim.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "staf-6",
      name: "Asmik Nasikah, S.Sy.", // TODO: Replace with verified KUA data
      position: "Penyuluh Agama Islam Ahli Pertama",
      roleCategory: "Penyuluh",
      description: "Melaksanakan bimbingan keagamaan Islam, pembinaan kemasjidan, dan fasilitasi majelis taklim di desa.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "staf-7",
      name: "Muhammad Yusuf Effendi, S.Pd.", // TODO: Replace with verified KUA data
      position: "Penyuluh Agama Islam Ahli Pertama",
      roleCategory: "Penyuluh",
      description: "Memberikan bimbingan dan penyuluhan agama Islam di masyarakat, termasuk pembinaan majelis taklim.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },{
      id: "staf-8",
      name: "Hizbiyah, S.Th.I.", // TODO: Replace with verified KUA data
      position: "Penyuluh Agama Islam Ahli Pertama",
      roleCategory: "Penyuluh",
      description: "Melaksanakan bimbingan keagamaan Islam, pembinaan kemasjidan, dan fasilitasi majelis taklim di desa.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },{
      id: "staf-9",
      name: "M. Sibghotulloh As Salafi, S.Ag.", // TODO: Replace with verified KUA data
      position: "Penyuluh Agama Islam Ahli Pertama",
      roleCategory: "Penyuluh",
      description: "Memberikan bimbingan dan penyuluhan agama Islam di masyarakat, termasuk pembinaan majelis taklim.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    }
  ],
};
