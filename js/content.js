/*
 * EDIT KONTEN DI BAWAH INI
 * File ini khusus data yang mudah diperbarui dari GitHub melalui browser HP.
 * Jangan menghapus koma atau tanda kurung. Simpan tanggal artikel sebagai YYYY-MM-DD.
 */
window.portfolioContent = {
  // BLOG: Tambahkan objek artikel di dalam array ini. Biarkan [] jika belum ada tulisan.
  // Contoh objek lengkap tersedia sebagai komentar setelah konfigurasi.
  blogPosts: [],

  // VIDEO PILIHAN: isi url dengan URL file MP4 langsung (mis. URL delivery Cloudinary berakhiran .mp4).
  // Jangan gunakan tautan halaman preview YouTube/Drive.
  featuredVideo: {
    title: "Mie ayam",
    description: "Mieayam.",
    url: "https://res.cloudinary.com/mk5m4ljb/video/upload/v1792055171/8c0ab0c667a834a8debc969d045b5fab.mp4",
    poster: "" // Opsional: path gambar poster/thumbnail, mis. images/video-poster.jpg
  },

  // BGM: isi url dengan file MP3 langsung. Musik tidak akan diputar sampai pengunjung menekan tombol.
  backgroundMusic: {
    title: "Surat cinta untuk starla",
    url: "https://res.cloudinary.com/mk5m4ljb/video/upload/v1792057801/AUD-20260126-WA0063.mp3",
    initialVolume: 0.25,
    playLabel: "Putar musik",
    pauseLabel: "Jeda musik"
  }
};

/*
CONTOH ARTIKEL — salin ke dalam array blogPosts (hapus tanda komentar luar) lalu ganti semua placeholder:
{
  slug: "judul-artikel-dengan-tanda-hubung",
  title: "Judul artikel yang kamu tulis sendiri",
  date: "2026-10-15", // opsional; ubah ke tanggal publikasi yang benar
  category: "Perjalanan belajar", // opsional
  summary: "Ringkasan singkat tulisan, sekitar satu atau dua kalimat.",
  cover: "images/artikel/nama-gambar.jpg", // opsional; bisa juga URL gambar langsung
  content: [
    { type: "paragraph", text: "Tulis paragraf pembuka berdasarkan pengalaman asli." },
    { type: "heading", text: "Hal yang kupelajari" },
    { type: "paragraph", text: "Tulis detail pengalaman atau pelajaran yang ingin dibagikan." },
    { type: "quote", text: "Kutipan pendek milik sendiri (opsional)." },
    { type: "list", items: ["Pelajaran pertama", "Pelajaran kedua"] }
  ]
}

Jenis isi yang didukung: paragraph, heading, quote, list.
Untuk menambah artikel, pisahkan objek dengan koma. Untuk mengubah, edit nilai objeknya.
Untuk menghapus artikel, hapus seluruh objek tersebut dari array.
*/
