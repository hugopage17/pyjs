import subprocess

results = subprocess.check_output(["netsh", "interface", "ipv4", "set", "address", "name=Wi-Fi", "static", "192.168.3.8", "255.255.255.0", "192.168.3.1"])
results = results.decode("ascii")
print(results)
