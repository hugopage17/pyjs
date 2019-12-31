from scapy.all import *
import time

while True:
    pkts = sniff(count=1,filter="tcp host 192.168.4.10")
    print(len(pkts))
    time.sleep(1)
