import re

with open('src/views/Legal/TermsConditions.js', 'r') as f:
    content = f.read()

# Make WA T&C more professional
old_wa_terms = r"""<ListItem>Pengguna menyetujui bahwa Admin Desa Ngawonggo dapat mengirimkan pesan WhatsApp yang berisi pembaruan status laporan, informasi layanan, atau pemberitahuan penting lainnya\.</ListItem>\s*<ListItem>Permintaan link verifikasi WhatsApp dibatasi satu kali setiap 3 jam untuk mencegah spamming dan penyalahgunaan gateway komunikasi kami\.</ListItem>\s*<ListItem>Pengguna bertanggung jawab untuk mendaftarkan nomor yang aktif dan sah\. Kami tidak bertanggung jawab atas kebocoran informasi yang disebabkan oleh kelalaian pengguna dalam menjaga akses ke akun WhatsApp mereka sendiri\.</ListItem>"""

new_wa_terms = """<ListItem>Pengguna menyetujui penerimaan notifikasi sistem otomatis terkait layanan administratif dan fungsionalitas keamanan.</ListItem>
                  <ListItem>Demi integritas sistem, permohonan verifikasi dibatasi secara wajar untuk mencegah beban lalu lintas jaringan.</ListItem>
                  <ListItem>Keakuratan dan keamanan nomor telepon yang didaftarkan sepenuhnya menjadi tanggung jawab pengguna akun yang bersangkutan.</ListItem>"""

content = re.sub(old_wa_terms, new_wa_terms, content)

with open('src/views/Legal/TermsConditions.js', 'w') as f:
    f.write(content)
