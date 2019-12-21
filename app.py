import eel
from get_time import GetTime
from pythonping import ping

eel.init('web')

@eel.expose
def runTime(num):
    try:
        return int(num)*2
    except:
        error = 'Error: invalid entry'
        return error

@eel.expose
def ping_ip(ip):
    try:
        response_list = ping(ip, size=32, count=10)
        return 'average response time: {}ms'.format(response_list.rtt_avg_ms)
    except:
        return "Host unreachable"

eel.start('main.html', size=(1040, 820))
