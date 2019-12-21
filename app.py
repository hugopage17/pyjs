import eel
from get_time import GetTime
eel.init('web')

@eel.expose
def runTime(num):
    try:
        return int(num)*2
    except:
        error = 'Error: invalid entry'
        return error

eel.start('main.html')
