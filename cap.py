import subprocess
subprocess.call(['runas', '/user:Administrator','netsh interface ipv4 set address name="Ethernet 2" static 192.168.36.12 255.255.255.0 192.168.36.1'])
