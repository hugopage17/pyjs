import eel
from pythonping import ping
import getpass
import subprocess
from scapy.all import *
import time
from getmac import get_mac_address
from mac_vendor_lookup import MacLookup
import requests
import webbrowser
import os
from tabulate import tabulate
from tkinter import filedialog
from tkinter import *
import json
import http.server
import socketserver
import requests
import math

eel.init('web')

@eel.expose
def get_user():
    user = getpass.getuser()
    return user

@eel.expose
def ping_ip(ip, bytes, timeout):
    timeout = int(timeout)/1000
    try:
        response_list = ping(ip, size=int(bytes), timeout=timeout, count=1)
        if response_list.rtt_avg_ms == timeout*1000:
            return "Host unreachable"
        else:
            return response_list.rtt_avg_ms
    except:
        return "Host unreachable"

@eel.expose
def export_ping(data, host):
    Tk().withdraw()
    title = host+'-ping'
    f = filedialog.asksaveasfile(mode='w', defaultextension=".txt", initialfile=title)
    file_data = tabulate(data, headers=["Bytes","Host", "Response Time", "Timeout"])
    f.write(file_data)
    f.close()

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
def wifi_analysis():
    results = subprocess.check_output(["netsh", "wlan", "show", "network", "mode=Bssid"])
    results = results.decode("ascii")
    return results


@eel.expose
def export():
    results = subprocess.check_output(["netsh", "wlan", "show", "network", "mode=Bssid"])
    results = results.decode("ascii")
    results = results.replace("\r","")
    return results

@eel.expose
def capture_traffic(ip):
    tx_rate = 0
    pkt = sniff(count=100,filter="host "+ip, timeout=10)
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
    mac = MacLookup()
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
        response = ping(i, size=32, timeout=1, count=1)
        res = str(response._responses[0])
        if res != 'Request timed out':
            try:
                ip_mac = get_mac_address(ip=i)
                vendor = mac.lookup(ip_mac)
            except:
                ip_mac = None
                vendor = None
            res_code = ''
            try:
                response = requests.get(url='https://'+i, verify=False, timeout=1)
                res_code = response.status_code
            except:
                res_code = 'no HTTPS'
            obj = {
                'ip':i,
                'mac':ip_mac,
                'vendor':vendor,
                'https_code':res_code
            }
            array_to_return.append(obj)
    return array_to_return

@eel.expose
def arp_scan():
    results = subprocess.check_output(['arp','-a'])
    results = results.decode("ascii")
    return results

@eel.expose
def export_ip_scan(data):
    Tk().withdraw()
    f = filedialog.asksaveasfile(mode='w', defaultextension=".txt", initialfile='ip-scan')
    file_data = tabulate(data, headers=["Host", "MAC Address", "Vendor"])
    f.write(file_data)
    f.close()

@eel.expose
def connect(user,host):
    cmd = '{}@{}'.format(user, host)
    subprocess.Popen(['ssh', cmd])

@eel.expose
def flood_ping(dst, timeout, size):
    timeout = int(timeout)/1000
    p = sr1(IP(dst=dst)/ICMP()/Raw(RandString(size=int(size))), timeout=timeout)
    if p == None:
        obj = {
            'res':'no packets received',
            'sum':'no packets received'
        }
        return obj
    else:
        obj = {
            'res':'success',
            'sum':p[0].summary()
        }
        return obj

@eel.expose
def get_nic():
    arr = []
    for i in get_windows_if_list():
        obj = {
            'name':i['name'],
            'ip':i['ips']
        }
        arr.append(obj)
    return arr

@eel.expose
def launch_server(port):
    Tk().withdraw()
    port = int(port)
    f = filedialog.askdirectory()
    os.chdir(f)
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), Handler) as httpd:
        webbrowser.open('http://localhost:{}'.format(port))
        httpd.serve_forever()

@eel.expose
def tracert(dst):
    results = subprocess.check_output(['tracert',dst])
    results = results.decode("ascii")
    return results

@eel.expose
def api_req(url, req_type, headers, body):
    r = ''
    if req_type == 'get':
        r = requests.get(url, headers=headers, timeout=10)
    elif req_type == 'post':
        r = requests.post(url, headers=headers, data=body)
    elif req_type == 'delete':
        r = requests.delete(url, headers=headers)
    try:
        res = r.json()
        res = json.dumps(res, indent=4, sort_keys=True)
    except:
        res = r.text.encode('utf8')
    time = r.elapsed.total_seconds()
    time = math.ceil(time*100)/100
    if time < 0.1:
        time = str(time*100)+'ms'
    elif time < 1:
        time = str(time*10)+'ms'
    else:
        time = str(time)+'s'
    obj = {
        'res':res,
        'code':r.status_code,
        'time':time
    }
    data = {
    'url':url,
    'req_type':req_type,
    'status_code':r.status_code
    }
    return obj


eel.start('main.html', size=(1240, 860))
