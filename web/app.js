let latency = []
let count = []
var c = 1
let max = 0
let min = 0

async function pingFunc(){
  count.push(c)
  let ip = document.getElementById('name').value
  let size = document.getElementById('size').value
  let timeout = document.getElementById('timeout').value
  let value = await eel.ping_ip(ip, size, timeout)();
  if(value >= max){
    max = value
  }
  if(min != 0 && min >= value){
    min = value
  }
  else if(min == 0){
    min = value
  }
  latency.push(value)
  config.data.datasets[0].data = latency
  window.myLine.update()
  let avg = latency.reduce((a, b) => a + b, 0)/latency.length
  avg = avg.toFixed(2)
  let time = value.toFixed(2)
  var p = document.createElement('DIV')
  p.id = 'ping-count-single'
  var p1 = document.createElement('label')
  p1.innerText = `Bytes: ${size}`
  p1.id = 'inner-ping-count'
  var p2 = document.createElement('label')
  p2.innerText = `Host: ${ip}`
  p2.id = 'inner-ping-count'
  p3 = document.createElement('label')
  p3.innerText = `Timeout: ${timeout}`
  p3.id = 'inner-ping-count'
  p4 = document.createElement('label')
  p4.innerText = `Response: ${value}ms`
  p4.id = 'inner-ping-count'
  p.appendChild(p1)
  p.appendChild(p2)
  p.appendChild(p4)
  p.appendChild(p3)
  document.getElementById('ping-counts').appendChild(p)
  document.getElementById('latency-avg').innerText = `Average: ${avg}ms`
  document.getElementById('min').innerText = `Minimum: ${min}ms`
  document.getElementById('max').innerText = `Maximum: ${max}ms`
  document.getElementById('packets-sent').innerText = `Packets Sent: ${c}`
  var element = document.getElementById("ping-counts");
  element.scrollTop = element.scrollHeight;
  c++
}

let runPing

function startPing() {
  runPing = setInterval(pingFunc,1000)
}

function stopPing(){
  clearInterval(runPing)
}

let signals = []
let ssids = []
async function startScan(){
  let data = await eel.wifi_scan()();
  for (var i = 0; i < data.length; i++) {
    signals.push(data[i].signal)
  }
  for (var j = 0; j < data.length; j++) {
    ssids.push(data[j].name)
  }
  barConfig.data.datasets[0].data = signals
  window.myLine.update()
}
