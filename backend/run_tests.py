import sys
import os

# Add AppData site-packages where pip installed packages
user_site = r"C:\Users\eswar\AppData\Roaming\Python\Python313\site-packages"
if user_site not in sys.path:
    sys.path.insert(0, user_site)

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import pytest

if __name__ == "__main__":
    exit_code = pytest.main(["tests/"])
    sys.exit(exit_code)
