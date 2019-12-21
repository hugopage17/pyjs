import time
import eel

class GetTime:
    @eel.expose
    def __init__(num):
        try:
            return int(num)*2
        except:
            error = 'Error: invalid entry'
            return error
