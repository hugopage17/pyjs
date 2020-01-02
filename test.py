from scapy.all import *
import time

while True:
    p=sniff(filter="icmp and host 10.167.4.44", count=1, timeout=1)
    hexdump(p)
    time.sleep(1)
