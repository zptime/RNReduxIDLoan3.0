import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';

import AppJSON from './../../app';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import HeaderModel from './../../components/common/HeaderModel'

class PrivacyScreen extends Component {
    constructor(props) {
        super(props);

        this.info = [
            {
                title: `1.Informasi yang di peroleh{${AppJSON.displayName}}, cara proses memperolehnya serta mengelolanya{${AppJSON.displayName}}`,
                text: `{${AppJSON.displayName}} mengumpulkan informasi pribadikonsumen seperti yang Anda berikan kepada kami melalui aplikasi dan menggunakan informasi daripenggunaan aplikasi yang secara otomatis di hasilkan oleh pengguna saat konsumenberinteraksi dengan aplikasi.`
            },
            {
                title: `2. Jenis Informasi yang di peroleh{${AppJSON.displayName}}`,
                text: `Informasi Pribadi: Termasuk nama, nomor ponsel, NIK, kontak darurat, foto identitas, alamat suratmenyurat, jabatan, alamat perusahaan, dll. Bertujuan untuk mengevaluasi informasi kreditPengguna dan supaya mudah dalam menghubungimereka.${'\n'}Informasi perangkat: informasi IP, alamat Wi-Fi, alamat MAC, versi Android, data provider internet, catatan panggilan, dll. Bertujuan untuk mengenaliperangkat ketika ada Pengguna login denganmenggunakan perangkat lain, dan ketika Penggunamelakukan hal tersebut, kami dapatmengidentifikasikan serta meminta Penggunauntuk lanjut ke tahap pengenalan ID dan untukmengamankan rekening Pengguna. Catatanpanggilan dan informasi lain yang didapatkanadalah untuk menghindari dan mencegah perilakupenipuan dari Pengguna.${'\n'}Informasi lokasi (hanya untuk layanan / fiturkhusus): Berbagai jenis informasi yang berkaitandengan lokasi Anda. Misalnya: kode negara, kodekota, kode jaringan seluler, informasi lintang danbujur, ini untuk memastikan bahwa lokasipengguna disertakan dalam layanan kami, danuntuk menilai nilai kredit Anda${'\n'}Informasi Bank: Termasuk nama, nomor rekening, dll.Kami juga mengumpulkan informasi pribadilainnya dan mengumpulkan informasi pekerjaan, informasi pihak ketiga, dll. Saat menggunakanlayanan tertentu. Tujuan mengumpulkan informasiini adalah untuk memperbaiki layanan yang kami berikan kepada Anda. Jenis dan jumlah informasi yang dikumpulkan tergantung pada bagaimanaAnda menggunakan, bergabung, atauberpartisipasi dalam produk atau layanan kami. Penggunaan layanan kami sepenuhnya bersifatsukarela dan Anda tidak perlu memberikaninformasi tersebut kecuali jika Anda memilih untukmenggunakan layanan {${AppJSON.displayName}}.`
            },
            {
                title: `3. Bagaimana {${AppJSON.displayName}} mengelolainformasi pribadi Anda`,
                text: `Informasi-informasi yang kami kumpulkan dariAnda akan di simpan secara elektronik, dan akankami kelola untuk berbagai keperluan sebagaiberikut;${'\n'}Untuk memeriksa bahwa pengajuan yang Andasudah lakukan memakai informasi Anda yang sebenarnya, bukan orang lain yang menggunakanidentitas Anda;${'\n'}Untuk menentukan kelayakan Anda dalammemperoleh pinjaman berdasarkan ketentuanyang berlaku;${'\n'}Untuk berkomunikasi dengan Anda tentang akunAnda, dan juga sebagai informasi dalammelakukan proses identifikasi ketika Andamenelepon atau mengunjungi aplikasi mobile kami, serta memberikan informasi terbaru jika adaperubahan pada layanan kami.${'\n'}Untuk mengkonfirmasi informasi-informasi yang di berikan oleh Anda bersifat asli saat proses pengajuan pinjaman sekaligus untukmengamankan proses transaksi tersebut apabilapinjaman Anda di setujui.${'\n'}Untuk menyelesaikan kewajiban kami yang timbuldari kontrak yang telah ditandatangani antarapihak Anda dengan kami.`
            },
            {
                title: `4. Cara {${AppJSON.displayName}} melindungiinformasi pribadi konsumen`,
                text: `(1) {${AppJSON.displayName}} berusaha untuk melindungiinformasi Anda dengan teknologi terbaru. Kami akan tetap berpegang kepada ketentuan yang berlaku untuk memastikan informasi Anda amandan terjaga, serta melakukan pembatasan aksesuntuk melindungi Anda dari segala macam bentukpenipuan. Anda bertanggung jawab untukmelindungi kode akses akun maupun user ID danpassword Anda tersebut, sehingga konsumen lain tidak dapat mengakses akun Anda.${'\n'}(2) Untuk informasi Anda, {${AppJSON.displayName}} tidak dapatmenjamin keamanan data Anda yang dikirimmelalui aplikasi kami, proses transmisi menjaditanggung jawab Anda. Ketika kami menerima data atau informasi Anda, kami akan menggunakanprosedur dan fitur keamanan yang ketat dalamupaya mencegah akses lain yang tidakberkepentingan.${'\n'}(3) {${AppJSON.displayName}} sepenuhnya mengikuti dan patuhpada hukum dan peraturan perundangan-undangantentang perlindungan data yang berlaku di indonesia.`
            },
            {
                title: `5. Pengecualian {${AppJSON.displayName}} dalampembagian informasi pribadi konsumen`,
                text: `{${AppJSON.displayName}} akan membuka informasi pribadikonsumen untuk penyedia layanan, peminjam dananggota grup perusahaan kami yang membantudalam melaksanakan bagian-bagian tertentu darioperasi bisnis kami termasuk proses layanan, pembayaran,pencegahan penipuan,penyimpanandata dan lainnya.${'\n'}{${AppJSON.displayName}} juga akan membagikan informasikonsumen kepada pihak ketiga dalam hal segalahukum dan pengadilan dalam hal untuk mencegahkerugian finansial, untuk melaporkan dugaanaktivitas ilegal, atau untuk meyelidiki pelanggaranperjanjian pengguna kami.${'\n'}{${AppJSON.displayName}} tidak akan menjual atau menyewakandata atau informasi konsumen kepada pihak ketigamanapun untuk keperluan apa saja, kecuali kami menerapkan perubahan kebijakan danmemberitahukan Anda tentang perubahantersebut.${'\n'}Tentu saja jika Anda memberikan kami informasipalsu dan tidak akurat dalam pengajuan terindikasiadanya penipuan dalam pengajuan pinjaman Anda, kami dapat mencatat hal tersebut dalam sejarahkredit Anda dan membagikan informasi tersebutkepada badan hukum atau pihakberwenang/lembaga pencegah penipuan.`
            },
            {
                title: '6. Usia',
                text: `Untuk dapat menggunakan layanan {${AppJSON.displayName}}kami, Anda harus berusia 18 tahun atau keatas. Jika Anda tidak memenuhi syarat usia tersebut, maka Anda tidak diizinkan atau diperkenankanuntuk menggunakan layanan {${AppJSON.displayName}} ini.`
            },
            {
                title: '7. Perubahan pada kebijakan privasi',
                text: 'Kami akan mengirimkan pemberitahuan melaluipesan teks atau surel terkait segala jenisperubahan sehubungan dengan kebijakan privasikami untuk meninjau kebijakan privasi yang baru.'
            },
            {
                title: '8. Mengenai Perjanjian PemberiPinjaman dengan Penerima Pinjaman',
                text: `(1) Perjanjian pemberian pinjaman antara PemberiPinjaman dengan Penerima Pinjaman dituangkandalam Dokumen Elektronik.${'\n'}(2) Dokumen Elektronik sebagaimana dimaksudpada ayat (1) wajib paling sedikit memuat:${'\n'}a.nomor perjanjian; b. tanggal perjanjian; c. identitas para pihak; d. ketentuan mengenaihak dan kewajiban para pihak; e. jumlah pinjaman; f. suku bunga pinjaman; g. nilai angsuran; h. jangkawaktu; i. objek jaminan (jika ada); j. rincian biayaterkait; k. ketentuan mengenai denda (jika ada); dan l. mekanisme penyelesaian sengketa.${'\n'}(3) Penyelenggara wajib menyediakan aksesinformasi kepada Penerima Pinjaman atas posisipinjaman yang diterima.${'\n'}(4) Akses informasi sebagaimana dimaksud padaayat (3) tidak termasuk informasi terkait identitasPemberi Pinjaman.`
            },
        ]

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
        }
    }

    componentWillMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>Kebijakan Privasi dan Ketentuan PenerimaPinjaman</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        this.info.map((item, index) => {
                            return (
                                <View key={index} style={LastStyles.privacyContentItem}>
                                    <Text style={LastStyles.privacyContentTitle}>{item.title}</Text>
                                    <Text style={LastStyles.privacyContentText}>{item.text}</Text>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

export default PrivacyScreen;