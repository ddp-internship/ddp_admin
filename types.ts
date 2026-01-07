export enum UserRole {
    SUPER_ADMIN = 1,
    ADMIN = 2,
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    role_id: UserRole;
    is_approved: number; // 0 or 1
    password?: string; // For mock registration
  }
  
  // Data Models
  export interface CapaianData {
    id: number;
    desa: string;
    dusun: string;
    rw: string;
    kelurahan: string;
    bangunan: number;
    kk: number;
    jiwa: number;
    laki: number;
    perempuan: number;
  }
  
  export interface Artikel {
    id: number;
    judul_artikel: string;
    kategori_id: number;
    tanggal: string;
    penulis: string;
    readmore: string;
    isi_artikel: string;
    gambar: string | null;
  }
  
  export interface Monografi {
    id: number;
    desa: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    tahun: number;
    ringkasan: string;
    gambar: string | null;
    link: string;
  }
  
  export interface Infografis {
    id: number;
    judul: string;
    keterangan: string;
    gambar: string[]; // JSON support
    link: string;
  }
  
  export interface JurnalBuku {
    id: number;
    judul: string;
    penulis: string;
    readmore: string;
    ringkasan: string;
    link: string;
    gambar: string | null;
  }
  
  export interface MitraTestimoni {
    id: number;
    nama: string;
    jabatan: string;
    isi: string;
    gambar: string | null;
  }
  
export interface DashboardStats {
    totalDesa: number;
    totalBerita: number;
    totalUser: number;
    totalTestimoni: number;
    totalGaleri: number;
    totalMitra: number;
    totalMonografi: number;
    totalInfografis: number;
}