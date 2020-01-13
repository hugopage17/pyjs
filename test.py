from scapy.all import *

arr = []
for i in get_windows_if_list():
    obj = {
        'name':i['name'],
        'ip':i['ips']
    }
    arr.append(obj)
return arr
