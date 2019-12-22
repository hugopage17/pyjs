import eel
from pythonping import ping

eel.init('web')

@eel.expose
def ping_ip(ip):
    try:
        response_list = ping(ip, size=32, count=10)
        return response_list.rtt_avg_ms
    except:
        return "Host unreachable"

eel.start('main.html', size=(1040, 820))
