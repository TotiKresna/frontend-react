describe('Pengujian Data Siswa', () => {
    const dummyStudent = {
        nama: 'toti ',
        kelas: 'usm',

    };

    const updatedStudent = {
        nama: 'Toti kw',
        kelas: 'usm smg',

    };

    // Proses login sebelum setiap pengujian
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[placeholder="Username"]').type('@super');
        cy.get('input[placeholder="Password"]').type('12345');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
        cy.visit('/students');
    });

    // // Pengujian Komponen Halaman Siswa
    // describe('Verifikasi Komponen Halaman Siswa', () => {
    //     it('Memastikan Semua Komponen Halaman Muncul', () => {
    //         // Cek heading
    //         cy.contains('Data Siswa').should('be.visible');

    //         // Cek tombol-tombol
    //         cy.get('button[aria-label="Sync"]').should('be.visible');
    //         cy.get('button[aria-label="create-student"]').contains('Create').should('be.visible');
    //         cy.get('button[aria-label="delete-student"]').contains('Delete').should('be.visible');

    //         // Cek input pencarian
    //         cy.get('input[placeholder="Search by name"]').should('be.visible');

    //         // Cek tombol export
    //         cy.get('button').contains('Export Excel').should('be.visible');
    //         cy.get('button').contains('Export PDF').should('be.visible');
    //     });
    // });

    // Pengujian Pembuatan Data Siswa
    describe('Membuat Data Siswa Baru', () => {
        it('Berhasil Membuat Data Siswa', () => {
            // Buka modal create
            cy.get('button[aria-label="create-student"]').contains('Create').click();

            // Verifikasi modal muncul
            cy.get('.chakra-modal__content').should('be.visible');
            cy.contains('Create Student').should('be.visible');

            // Isi formulir
            cy.get('input[placeholder="Nama"]').type(dummyStudent.nama);
            cy.get('input[placeholder="Kelas"]').type(dummyStudent.kelas);


            // Submit formulir
            cy.get('button[type="submit"]').click({force: true});

            // Tunggu modal tertutup
            cy.get('.chakra-modal__content').should('not.exist');

            // Tambahkan delay
            cy.wait(2000);
        });
    });

    // Pengujian Pencarian Data Siswa
    describe('Pencarian Data Siswa', () => {
        it('Berhasil Mencari Data Siswa yang Baru Dibuat', () => {
            // Pencarian data siswa
            cy.get('input[placeholder="Search by name"]')
                .type(dummyStudent.nama);

            // Memverifikasi hasil muncul
            cy.get('table tbody tr').should('have.length.at.least', 1);
            cy.contains('table tbody tr', dummyStudent.nama).should('be.visible');
        });
    });

    // Pengujian Perubahan Data Siswa
    describe('Mengubah Data Siswa', () => {
        it('Berhasil Memperbarui Data Siswa', () => {
            // Cari data siswa untuk diedit
            cy.get('input[placeholder="Search by name"]')
                .type(dummyStudent.nama);

            // Buka modal edit untuk siswa pertama yang muncul
            cy.contains('table tbody tr', dummyStudent.nama)
                .find('button[aria-label="edit-student"]')
                .click();

            // Verifikasi modal edit muncul
            cy.get('.chakra-modal__content').should('be.visible');
            cy.contains('Edit Student').should('be.visible');

            // Perbarui formulir
            cy.get('input[placeholder="Nama"]').clear().type(updatedStudent.nama);
            cy.get('input[placeholder="Kelas"]').clear().type(updatedStudent.kelas);

            // Submit formulir
            cy.get('button[type="submit"]').click();

            // Tunggu modal tertutup
            cy.get('.chakra-modal__content').should('not.exist');

            // Tambahkan delay
            cy.wait(2000);
        });
    });

    // Pengujian Penghapusan Data Siswa
    describe('Menghapus Data Siswa', () => {
        it('Berhasil Menghapus Data Siswa', () => {
            // Cari data siswa yang akan dihapus
            cy.get('input[placeholder="Search by name"]')
                .clear()
                .type(updatedStudent.nama);

            // Memverifikasi hasil muncul
            cy.get('table tbody tr').should('have.length.at.least', 1);
            cy.contains('table tbody tr', updatedStudent.nama).should('be.visible');

            // Pilih checkbox untuk dihapus
            cy.contains('table tbody tr', updatedStudent.nama)
                .find('input[type="checkbox"]')
                .check({ force: true });

            // Klik tombol hapus
            cy.get('button[aria-label="delete-student"]').click();

            // Mengonfirmasi penghapusan
            cy.get('button.swal2-confirm.swal2-styled.swal2-default-outline')
              .should('be.visible')
              .click();

            // Menekan tombol OK
            cy.get('button.swal2-confirm.swal2-styled')
              .should('be.visible')
              .click();
              
            // Tambahkan delay
            cy.wait(2000);
        });
    });

    // Pengujian Verifikasi Penghapusan
    describe('Verifikasi Penghapusan Data Siswa', () => {
        it('Memastikan Data Siswa Telah Dihapus', () => {
            // Cari kembali nama yang dihapus
            cy.get('input[placeholder="Search by name"]')
                .clear()
                .type(updatedStudent.nama);

            // Memastikan tidak ada hasil yang ditemukan
            cy.get('table tbody tr').should('have.length', 0);
        });
    });
});