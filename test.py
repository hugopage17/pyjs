import subprocess
import sys
import pyfiglet
from colorama import Fore, Back, Style, init
import six
from termcolor import colored
import os
init()

print('',Fore.CYAN)
ascii_banner = pyfiglet.figlet_format('X-VYPER')
print(ascii_banner)
Style.RESET_ALL


user = sys.argv[1]
host = sys.argv[2]
type = sys.argv[3]

cmd = '{}@{}'.format(user, host)
try:
    if type == 'ssh':
        print('Establishing ssh connection to {} as {}'.format(host, user))
        subprocess.Popen(['ssh', cmd])
    elif type == 'telnet':
        subprocess.Popen(['telnet', host])
except:
    print('failed to connect to {}'.format(host))
