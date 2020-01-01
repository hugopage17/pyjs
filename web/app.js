let latency = []
let count = []
let txRate = []
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
  const sigStn = document.getElementById('sig-stn').value
  let data = await eel.wifi_scan(sigStn)();
  for (var i = 0; i < data.length; i++) {
    signals.push(data[i].signal)
  }
  for (var j = 0; j < data.length; j++) {
    ssids.push(data[j].name)
  }
  barConfig.data.datasets[0].data = signals
  window.myLine.update()
}

async function exportFile(){
  let data = await eel.export()();
  Swal.fire('Breakdown',data)
 }
 function browseResult(e){
  var fileselector = document.getElementById('fileselector');
  console.log(fileselector.value);
}

async function captureTraffic(){
  count.push(c)
  const ip = document.getElementById('ip-add').value
  let traffic = await eel.capture_traffic(ip)();
  txRate.push(traffic.rate)
  trafficConfig.data.datasets[0].data = txRate
  window.myLine.update()
  c++
  document.getElementById('traffic-txt').innerText = `TX Rate: ${traffic.rate}kb`
  document.getElementById('tcp').innerText = `Packet:     ${traffic.types[0]}`
  document.getElementById('udp').innerText = traffic.types[1]
  document.getElementById('icmp').innerText = traffic.types[2]
  document.getElementById('other').innerText = traffic.types[3]
}

let runCT

function startCP(){
  runCT = setInterval(captureTraffic, 1000)
}

function stopCP(){
  clearInterval(runCT)
}

async function startScan(){
  range = document.getElementById('ip-range').value
  document.getElementById('spinner').hidden = false
  let results = await eel.ip_scan(range)()
  document.getElementById('spinner').hidden = true
  var displayer = document.getElementById('ip-discovered')
  for (var i = 0; i < results.length; i++) {
    var d = document.createElement('div')
    d.id = 'inner-ip-scan'
    var ip = document.createElement('label')
    ip.innerText = `IP Address: ${results[i].ip}`
    ip.style.marginRight = '40px'
    if(results[i].mac != null){
      var mac = document.createElement('label')
      mac.innerText = `MAC Address: ${results[i].mac}`
    }
    d.appendChild(ip)
    d.appendChild(mac)
    displayer.appendChild(d)
  }
}
