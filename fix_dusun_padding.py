file_path = "src/views/DusunPage/index.js"
with open(file_path, "r") as f:
    content = f.read()

# Add top padding to the first box in the return
# The return starts with <Box pb={20}>
content = content.replace("<Box pb={20}>", "<Box pt={{ base: \"100px\", md: \"140px\" }} pb={20}>")

with open(file_path, "w") as f:
    f.write(content)
