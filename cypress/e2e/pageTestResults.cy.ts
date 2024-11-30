describe('Pengujian Hasil Tes', () => {
    const dummyTestResult = {
      nama: 'toti',
      kelas: 'usm',
      operasiTambah: '12.34',
      operasiKurang: '34.56',
      operasiKali: '56.78',
      operasiBagi: '78.90'
    };
  
    const updatedTestResult = {
      nama: 'toti',
      kelas: 'usm',
      operasiTambah: '15.67',
      operasiKurang: '40.89',
      operasiKali: '60.12',
      operasiBagi: '85.23'
    };
  
    // Proses login sebelum setiap pengujian
    beforeEach(() => {
      cy.visit('/login');
      cy.get('input[placeholder="Username"]').type('@super');
      cy.get('input[placeholder="Password"]').type('12345');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
      cy.visit('/test-results');
    });

    // Pengujian Pembuatan Hasil Tes
    describe('Membuat Hasil Tes Baru', () => {
      it('Berhasil Membuat Hasil Tes', () => {
        // Navigasi ke halaman pembuatan
        cy.get('a[href="/test-results/create"]').contains('Create').click();
        cy.url().should('include', '/test-results/create');
  
        // Mengisi formulir
        cy.get('input[placeholder="Nama Siswa"]').type(dummyTestResult.nama);
        cy.get('input[placeholder="Kelas"]').type(dummyTestResult.kelas);
        cy.get('input[placeholder="Operasi Tambah"]').type(dummyTestResult.operasiTambah);
        cy.get('input[placeholder="Operasi Kurang"]').type(dummyTestResult.operasiKurang);
        cy.get('input[placeholder="Operasi Kali"]').type(dummyTestResult.operasiKali);
        cy.get('input[placeholder="Operasi Bagi"]').type(dummyTestResult.operasiBagi);
  
        // Mengirim formulir
        cy.get('button[type="submit"]').click();

        // Menambahkan delay setelah submit
        cy.wait(5000); // Delay 2 detik
      });
    });

    // Pengujian Pencarian Hasil Tes
    describe('Pencarian Hasil Tes', () => {
      it('Berhasil Mencari Hasil Tes yang Baru Dibuat', () => {
        // Pencarian hasil tes
        cy.get('input[placeholder="Search by name"]')
          .type(dummyTestResult.nama);
  
        // Memverifikasi hasil muncul
        cy.get('table tbody tr').should('have.length.at.least', 1);
        cy.contains('table tbody tr', dummyTestResult.nama).should('be.visible');
      });
    });

    // Pengujian Perubahan Hasil Tes
    describe('Mengubah Hasil Tes', () => {
      it('Berhasil Memperbarui Hasil Tes', () => {
        // Mencari hasil tes
        cy.get('input[placeholder="Search by name"]')
          .type(dummyTestResult.nama);
  
        // Memilih untuk mengedit
        cy.contains('table tbody tr', dummyTestResult.nama)
          .contains('Edit')
          .click();
  
        // Verifikasi halaman edit
        cy.url().should('match', /\/test-results\/[a-zA-Z0-9]+\/edit$/);
  
        // Memperbarui formulir
        cy.get('input[placeholder="Operasi Tambah"]').clear().type(updatedTestResult.operasiTambah);
        cy.get('input[placeholder="Operasi Kurang"]').clear().type(updatedTestResult.operasiKurang);
        cy.get('input[placeholder="Operasi Kali"]').clear().type(updatedTestResult.operasiKali);
        cy.get('input[placeholder="Operasi Bagi"]').clear().type(updatedTestResult.operasiBagi);
  
        // Mengirim formulir yang diperbarui
        cy.get('button[type="submit"]').click();

        // Menambahkan delay setelah submit
        cy.wait(2000); // Delay 2 detik
      });
    });

    // Pengujian Penghapusan Hasil Tes
    describe('Menghapus Hasil Tes', () => {
      it('Berhasil Menghapus Hasil Tes', () => {
        // Mencari hasil tes yang diperbarui
        cy.get('input[placeholder="Search by name"]')
          .clear()
          .type(updatedTestResult.nama);
  
        // Memverifikasi hasil muncul
        cy.get('table tbody tr').should('have.length.at.least', 1);
        cy.contains('table tbody tr', updatedTestResult.nama).should('be.visible');
  
        // Memilih checkbox untuk dihapus
        cy.contains('table tbody tr', updatedTestResult.nama)
          .find('input[type="checkbox"]')
          .check({ force: true });
  
        // Mengklik tombol hapus
        cy.get('button[aria-label="delete-test-result"]').click();
  
        // Mengonfirmasi penghapusan
        cy.get('button.swal2-confirm.swal2-styled.swal2-default-outline')
          .should('be.visible')
          .click();

        // Menekan tombol OK
        cy.get('button.swal2-confirm.swal2-styled')
          .should('be.visible')
          .click();

        // Menambahkan delay setelah submit
        cy.wait(2000); // Delay 2 detik
      });
    });

    // Pengujian Verifikasi Penghapusan
    describe('Verifikasi Penghapusan Hasil Tes', () => {
      it('Memastikan Hasil Tes Telah Dihapus', () => {
        // Mencari kembali nama yang dihapus
        cy.get('input[placeholder="Search by name"]')
          .clear()
          .type(updatedTestResult.nama);
  
        // Memastikan tidak ada hasil yang ditemukan
        cy.get('table tbody tr').should('have.length', 0);
      });
    });
});