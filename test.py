import socket

TCP_IP = '172.0.0.1'
TCP_PORT = 5005
BUFFER_SIZE = 1024
MESSAGE = "Hello, World!"
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((TCP_IP, TCP_PORT))
s.listen(1)
conn, addr = s.accept()
while 1:
    data = conn.recv(BUFFER_SIZE)
    if not data: break
    conn.send(data)  # echo
conn.close()
