from pythonping import ping
from colorama import init
from colorama import Fore, Back, Style
from time import sleep

init()

while True:
    response_list = ping('172.25.41.91', size=32, timeout=1, count=1)
    if response_list.rtt_avg_ms == 1000:
        print(Fore.RED + 'OFFLINE')
    else:
        print(Fore.GREEN + 'ONLINE: '+str(response_list.rtt_avg_ms)+'ms')
    sleep(1)
