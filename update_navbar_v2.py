import sys

file_path = "src/components/Navbar.js"
with open(file_path, "r") as f:
    content = f.read()

# Update DesktopNav link size and spacing to be more professional
content = content.replace("fontSize={'11px'}", "fontSize={'xs'}")
content = content.replace("spacing={2} align=\"center\"", "spacing={1} align=\"center\"")
content = content.replace("p={1.5}", "p={2}")

with open(file_path, "w") as f:
    f.write(content)
print("Updated DesktopNav styles")
