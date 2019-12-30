import eel
from pythonping import ping
import getpass

eel.init('web')

@eel.expose
def get_user():
    user = getpass.getuser()
    return user

@eel.expose
def ping_ip(ip, bytes, timeout):
    try:
        response_list = ping(ip, size=int(bytes), timeout=int(timeout), count=10)
        return response_list.rtt_avg_ms
    except:
        return "Host unreachable"

@eel.expose
def get_html(file):
    f = open('html-strings/'+file, "r")
    html = f.read()
    return html

eel.start('main.html', size=(1240, 860))
