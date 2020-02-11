import subprocess
import sys

user = sys.argv[1]
host = sys.argv[2]

print('Connecting to {} as {}'.format(host, user))
cmd = '{}@{}'.format(user, host)
try:
    subprocess.Popen(['ssh', cmd])
except:
    print('failed to connect to {}'.format(host))
