export interface Student {
    _id?: string;
    nama: string;
    kelas: string;
  }

export interface TestResult {
    _id?: string;
    student_id?: {
      _id: string;
      nama: string;
      kelas: string;
    };
    nama: string;
    kelas: string;
    opm_tambah: string | number;
    opm_kurang: string | number;
    opm_kali: string | number;
    opm_bagi: string | number;
    opm_total?: number;
  }

export  interface User {
    id: string;
    username: string;
    role: 'superadmin' | 'admin' | 'user';
  }