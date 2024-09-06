import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Student } from '../types/types';

export const exportToPDF = (students: Student[]) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['No', 'Nama', 'Kelas']],
    body: students.map((student, index) => [
      index + 1,
      student.nama,
      student.kelas,
    ]),
  });
  doc.save('students.pdf');
};

export const exportToExcel = (students: Student[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map((student, index) => ({
      No: index + 1,
      Nama: student.nama,
      Kelas: student.kelas,
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  XLSX.writeFile(workbook, 'students.xlsx');
};