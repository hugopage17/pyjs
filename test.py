from scapy.all import *
import time

try:
    p = sr1(IP(dst="192.168.1.1")/ICMP()/"XXXXXXXXXXX", timeout=1)
    if p == None:
        print('No packets Received')
except:
    print('failed')
