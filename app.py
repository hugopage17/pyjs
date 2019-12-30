import eel
from pythonping import ping
import pyshark

eel.init('web')

@eel.expose
def ping_ip(ip):
    try:
        response_list = ping(ip, size=32, count=10)
        return response_list.rtt_avg_ms
    except:
        return "Host unreachable"

@eel.expose
def getHtml(file):
    f = open('html-strings/'+file, "r")
    html = f.read()
    return html

eel.start('main.html', size=(1240, 860))
