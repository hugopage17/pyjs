import eel
from get_time import GetTime
eel.init('web')

timer = GetTime

@eel.expose
def runTime(n):
    timer.time(n)

eel.start('main.html')
