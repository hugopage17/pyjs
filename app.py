import eel
from pythonping import ping
import getpass
import subprocess

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
def wifi_scan():
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
    return new_arr

@eel.expose
def export():
    results = subprocess.check_output(["netsh", "wlan", "show", "network", "mode=Bssid"])
    results = results.decode("ascii")
    results = results.replace("\r","")
    return results

eel.start('main.html', size=(1240, 860))
