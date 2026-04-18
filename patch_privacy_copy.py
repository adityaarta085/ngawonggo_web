import re

with open('src/views/Legal/PrivacyPolicy.js', 'r') as f:
    content = f.read()

# Make WA privacy policy more professional
old_wa_privacy = r"""<ListItem>\s*<Text as="span" fontWeight="bold">Tujuan Penggunaan:</Text> Nomor WhatsApp akan digunakan oleh admin untuk mengirimkan notifikasi penting, seperti pembaruan status pengaduan/laporan, dan pengumuman layanan desa\.\s*</ListItem>\s*<ListItem>\s*<Text as="span" fontWeight="bold">Keamanan Data:</Text> Nomor WhatsApp disimpan dengan aman di database kami dan tidak akan disalahgunakan, dibagikan, atau dijual kepada pihak ketiga di luar kepentingan administratif desa\.\s*</ListItem>\s*<ListItem>\s*<Text as="span" fontWeight="bold">Komunikasi Positif:</Text> Kami berhak menggunakan nomor WhatsApp yang terverifikasi untuk tujuan "Positive Communication" \(pengumuman resmi\) sebagaimana kami mengelola komunikasi melalui email\.\s*</ListItem>"""

new_wa_privacy = """<ListItem>
                  <Text as="span" fontWeight="bold">Fungsionalitas:</Text> Digunakan secara eksklusif untuk notifikasi sistem otomatis dan peningkatan keamanan.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Keamanan Data:</Text> Disimpan dalam enkripsi pada basis data kami, tidak dibagikan atau dijual kepada entitas pihak ketiga.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight="bold">Pemberitahuan Esensial:</Text> Terbatas pada pembaruan layanan administratif yang relevan dan mendesak.
                </ListItem>"""

content = re.sub(old_wa_privacy, new_wa_privacy, content)

with open('src/views/Legal/PrivacyPolicy.js', 'w') as f:
    f.write(content)
