import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const ExportPDF = (testResults: any[]) => {
    const doc = new jsPDF();
    autoTable(doc, {
        head: [["No", "Nama Siswa", "Kelas", "OPM Tambah", "OPM Kurang", "OPM Kali", "OPM Bagi", "OPM Total"]],
        body: testResults.map((result, index) => [
            index + 1,
            result.student_id.nama,
            result.student_id.kelas,
            result.opm_tambah,
            result.opm_kurang,
            result.opm_kali,
            result.opm_bagi,
            result.opm_total,
        ]),
    });
    doc.save("test_results.pdf");
};

export const ExportExcel = (testResults: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(
        testResults.map((result, index) => ({
            Nama: result.student_id.nama,
            Kelas: result.student_id.kelas,
            OPM_Tambah: result.opm_tambah,
            OPM_Kurang: result.opm_kurang,
            OPM_Kali: result.opm_kali,
            OPM_Bagi: result.opm_bagi,
            OPM_Total: result.opm_total,
        }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestResults");
    XLSX.writeFile(workbook, "test_results.xlsx");
};