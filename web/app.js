let array = []

function getTime() {
  setInterval(async function(){
    let ip = document.getElementById('name').value
    let value = await eel.ping_ip(ip)();
    array.push(value)
    console.log(array);
  },1000)
}
