import sys

with open("src/translations/index.js", "r") as f:
    content = f.read()

content = content.replace("anime: 'Anime (NEW)',", "anime: 'Anime (NEW)',\n      topup: 'Topup (NEW)',")

with open("src/translations/index.js", "w") as f:
    f.write(content)
