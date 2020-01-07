import subprocess
import sys
import time

cmd = '{}@{}'.format(sys.argv[1], sys.argv[2])
subprocess.Popen(['ssh', cmd])
time.sleep(10)
