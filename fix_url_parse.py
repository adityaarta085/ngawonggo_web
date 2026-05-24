with open('src/components/CustomAds.js', 'r') as f:
    content = f.read()

# Protect URL parsing
content = content.replace("{new URL(ad.action_url).hostname.replace('www.', '')}", "{(() => { try { return new URL(ad.action_url).hostname.replace('www.', ''); } catch(e) { return 'Kunjungi Situs'; } })()}")

with open('src/components/CustomAds.js', 'w') as f:
    f.write(content)
