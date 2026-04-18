import re

with open('src/views/AuthPage/index.js', 'r') as f:
    auth_content = f.read()

# 1. Remove WA imports and state
auth_content = re.sub(r"const \[whatsappNumber, setWhatsappNumber\] = useState\(''\);\n", "", auth_content)
auth_content = re.sub(r"const \[verificationCode, setVerificationCode\] = useState\(''\);\n", "", auth_content)
auth_content = re.sub(r"const \[step, setStep\] = useState\(1\);\n", "", auth_content)
auth_content = re.sub(r"const \[expectedCode, setExpectedCode\] = useState\(''\);\n", "", auth_content)
auth_content = re.sub(r"FaWhatsapp, ", "", auth_content)
auth_content = re.sub(r"const generateCode = \(\) => Math\.floor\(100000 \+ Math\.random\(\) \* 900000\)\.toString\(\);\n\n", "", auth_content)

# Remove handleWhatsappLogin entirely
auth_content = re.sub(r"const handleWhatsappLogin = async \(\) => \{[\s\S]*?^  };\n", "", auth_content, flags=re.MULTILINE)
# Remove handleVerifyCode entirely
auth_content = re.sub(r"const handleVerifyCode = async \(\) => \{[\s\S]*?^  };\n", "", auth_content, flags=re.MULTILINE)


# Remove the Step conditional render (step === 1 ? ... : step === 'whatsapp_input' ? ... )
# Wait, let's just replace the whole section since it's easier.
# We'll just replace the whole Tabs/Buttons area

with open('src/views/AuthPage/index.js', 'w') as f:
    f.write(auth_content)
