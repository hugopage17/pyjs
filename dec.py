def smart_divide(func):
   def inner(a,b):
      print(a,b)
      return func(a,b)
   return inner

@smart_divide
def divide(a,b):
    return '{0} + {1} = {2}'.format(a,b,a+b)

@smart_divide
def hello(p1, p2):
    pass

hello('hello', 'world')
