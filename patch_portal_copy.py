import re

with open('src/views/PortalPage/index.js', 'r') as f:
    content = f.read()

# Replace the text inside the unverified box
old_text = r"""<Text fontSize="sm" color="gray\.600" mb=\{4\}>\s*Verifikasi nomor WhatsApp Anda \(Tidak Wajib\)\. Keuntungan:\s*<UnorderedList mt=\{2\} pl=\{4\}>\s*<ListItem>Menerima notifikasi update pengaduan langsung ke WA Anda\.</ListItem>\s*<ListItem>Mendapatkan informasi terbaru dari Admin Desa Ngawonggo\.</ListItem>\s*<ListItem>Membuka fitur eksklusif di masa mendatang\.</ListItem>\s*</UnorderedList>\s*</Text>"""
new_text = """<Text fontSize="sm" color="gray.600" mb={4}>
                            Verifikasi nomor WhatsApp opsional untuk meningkatkan fungsionalitas dan keamanan akun Anda. Keuntungan:
                            <UnorderedList mt={2} pl={4}>
                                <ListItem>Peningkatan lapisan keamanan (Verifikasi 2 Langkah).</ListItem>
                                <ListItem>Notifikasi sistem otomatis.</ListItem>
                                <ListItem>Akses fitur tambahan Portal Desa.</ListItem>
                            </UnorderedList>
                        </Text>"""

content = re.sub(old_text, new_text, content)

# Replace the text inside the verified box
old_verified = r"""<AlertDescription fontSize="sm">\s*Nomor WhatsApp Anda \(\{user\?\.user_metadata\?\.whatsapp_number\}\) sudah terhubung\. Anda akan menerima notifikasi dari Admin jika ada update layanan\.\s*</AlertDescription>"""
new_verified = """<AlertDescription fontSize="sm">
                                Nomor WhatsApp Anda ({user?.user_metadata?.whatsapp_number}) telah berhasil dihubungkan.
                            </AlertDescription>"""

content = re.sub(old_verified, new_verified, content)

with open('src/views/PortalPage/index.js', 'w') as f:
    f.write(content)
