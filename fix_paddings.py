import os

views_dir = "src/views"
files_to_fix = [
    "ProfilPage/index.js",
    "PemerintahanPage/index.js",
    "LayananPage/index.js",
    "JelajahiPage/index.js",
    "TransparansiPage/index.js",
    "KontakPage/index.js",
    "MediaPage/index.js",
    "EduGamePage/index.js",
    "NewsPage/index.js",
    "QuranPage/index.js"
]

for file_rel_path in files_to_fix:
    file_path = os.path.join(views_dir, file_rel_path)
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            content = f.read()

        # Increase top padding to account for fixed navbar (approx 100-140px)
        new_content = content.replace('pt={{ base: "20px", md: "40px" }}', 'pt={{ base: "100px", md: "140px" }}')
        new_content = new_content.replace('pt={{ base: "12", md: "20" }}', 'pt={{ base: "100px", md: "140px" }}')

        if new_content != content:
            with open(file_path, "w") as f:
                f.write(new_content)
            print(f"Fixed padding in {file_path}")
        else:
            # Try a more generic replacement for Box/Flex at the start of return
            import re
            # Match <Box or <Flex followed by pt=...
            pattern = r'<(Box|Flex|Container)\s+pt=\{\{\s*base:\s*["\x27]?\d+["\x27]?,\s*md:\s*["\x27]?\d+["\x27]?\s*\}\}'
            replacement = r'<\1 pt={{ base: "100px", md: "140px" }}'
            new_content = re.sub(pattern, replacement, content)

            if new_content != content:
                with open(file_path, "w") as f:
                    f.write(new_content)
                print(f"Fixed padding (regex) in {file_path}")
            else:
                print(f"No match in {file_path}")
