import eel
import time

eel.init('web')

@eel.expose
def getTime(num):
    try:
        return int(num)*2
    except:
        error = 'Error: invalid entry'
        return error

eel.start('main.html')
