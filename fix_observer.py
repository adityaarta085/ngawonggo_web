with open('src/components/CustomAds.js', 'r') as f:
    content = f.read()

content = content.replace("const observer = new IntersectionObserver(", "if (typeof IntersectionObserver === 'undefined') return;\n    const observer = new IntersectionObserver(")

with open('src/components/CustomAds.js', 'w') as f:
    f.write(content)
