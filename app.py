import eel
from pythonping import ping
import getpass
import subprocess
from scapy.all import *
import time
from getmac import get_mac_address

eel.init('web')

@eel.expose
def get_user():
    user = getpass.getuser()
    return user

@eel.expose
def ping_ip(ip, bytes, timeout):
    try:
        response_list = ping(ip, size=int(bytes), timeout=int(timeout), count=1)
        return response_list.rtt_avg_ms
    except:
        return "Host unreachable"

@eel.expose
def get_html(file):
    f = open('html-strings/'+file, "r")
    html = f.read()
    return html

@eel.expose
def wifi_scan(stn):
    try:
        stn = int(stn)
    except:
        pass
    results = subprocess.check_output(["netsh", "wlan", "show", "network", "mode=Bssid"])
    results = results.decode("ascii")
    results = results.replace("\r","")
    ls = results.split("\n")
    ls = ls[4:]
    ssids = []
    x = 0
    for l in ls:
        i = l.split(':')
        sd = i[0][0:4]
        if sd == 'SSID':
            name = i[1]
        elif i[0] == '         Signal             ':
            strength = i[1]
            strength = strength.split('%')[0]
            strength = int(strength)
        try:
            obj = {
                "name":name,
                "signal":strength
            }
            ssids.append(obj)
        except:
            pass
    arr = []
    for i in range(0, len(ssids)):
        if ssids[i] not in ssids[i+1:]:
            arr.append(ssids[i])
    new_arr = []
    for h in range(0, len(arr)):
        try:
            if arr[h]['name'] is not arr[h-1]['name']:
                new_arr.append(arr[h])
        except:
            pass
    if len(new_arr) == 0:
        new_arr.append(arr[0])
    if stn is not '':
        sig_filter = []
        for s in new_arr:
            if stn <= s['signal']:
                sig_filter.append(s)
        new_arr = sig_filter
    return new_arr

@eel.expose
def export():
    results = subprocess.check_output(["netsh", "wlan", "show", "network", "mode=Bssid"])
    results = results.decode("ascii")
    results = results.replace("\r","")
    return results

@eel.expose
def capture_traffic(ip):
    tx_rate = 0
    pkt = sniff(count=100,filter="tcp host "+ip)
    for p in range(len(pkt)):
        new_p = raw(pkt[p])
        tx_rate += len(new_p)
    tx_rate = tx_rate/1000
    each_type = str(pkt).split(' ')
    each_type[4] = str(each_type[4]).split('>')[0]
    packet_types = [each_type[1], each_type[2], each_type[3], each_type[4]]
    obj = {
        'rate':tx_rate,
        'types':packet_types
    }
    return obj

@eel.expose
def ip_scan(range):
    range = range.split('-')
    last_oct = range[1]
    first_oct = str(range[0]).split('.')[3]
    range = str(range[0]).split('.')
    range.remove(range[3])
    finder = int(first_oct)
    all_ips = []
    array_to_return = []
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
            obj = {
                'ip':i,
                'mac':ip_mac
            }
            array_to_return.append(obj)
    return array_to_return

eel.start('main.html', size=(1240, 860))
