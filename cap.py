from pythonping import ping
from getmac import get_mac_address

range = '10.167.4.37-47'
range = range.split('-')
last_oct = range[1]
first_oct = str(range[0]).split('.')[3]
range = str(range[0]).split('.')
range.remove(range[3])
finder = int(first_oct)
all_ips = []


range = '.'.join(range)

while finder <= int(last_oct):
    ip = range+'.'+str(finder)
    all_ips.append(ip)
    finder+=1

for i in all_ips:
    response = ping(i, size=32, timeout=3, count=1)
    res = str(response._responses[0])
    if res != 'Request timed out':
        ip_mac = get_mac_address(ip=i)
        print(ip_mac)
