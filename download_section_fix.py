import sys

content = open('src/views/ProfilPage/components/DownloadSection.js').read()

search_text = """    try {
      const canvas = document.createElement('canvas');"""

replace_text = """    try {
      const logoImg = new window.Image();
      logoImg.src = '/logo_desa.png';
      await new Promise(resolve => { logoImg.onload = resolve; });

      const canvas = document.createElement('canvas');"""

content = content.replace(search_text, replace_text)

search_draw = """        // Draw logo image
        ctx.fillStyle = '#2D5A27';
        const p = new Path2D('M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z');
        ctx.translate(-12, -12);
        ctx.fill(p);"""

replace_draw = """        // Draw logo image
        ctx.drawImage(logoImg, -40, -40, 80, 80);"""

content = content.replace(search_draw, replace_draw)

with open('src/views/ProfilPage/components/DownloadSection.js', 'w') as f:
    f.write(content)
