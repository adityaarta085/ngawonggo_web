import sys

with open("src/components/Navbar.js", "r") as f:
    content = f.read()

# find NAV_ITEMS declaration
target = "label: t.anime,\n      href: '/anime',\n    },"
replacement = "label: t.anime,\n      href: '/anime',\n    },\n    {\n      label: t.topup,\n      href: '/topup',\n    },"

if replacement not in content:
    content = content.replace(target, replacement)

with open("src/components/Navbar.js", "w") as f:
    f.write(content)
