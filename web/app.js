async function getTime() {
  let ip = document.getElementById('name').value
  let value = await eel.ping_ip(ip)();
  alert(`average response time: ${value}`)
}
