import sys
import re

with open("src/views/TopupPage/index.js", "r") as f:
    content = f.read()

# remove unused imports
content = content.replace("  SimpleGrid,\n  Badge,\n", "")

# Disable exhaustive deps on useEffect
content = content.replace("fetchServices('prepaid');\n  }, []);", "fetchServices('prepaid');\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, []);")

with open("src/views/TopupPage/index.js", "w") as f:
    f.write(content)
