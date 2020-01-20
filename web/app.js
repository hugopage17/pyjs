let latency = []
let count = []
let txRate = []
var c = 1
let max = 0
let min = 0
let pingpl = 0

async function pingFunc(){
  count.push(c)
  let ip = document.getElementById('name').value
  let size = document.getElementById('size').value
  let timeout = document.getElementById('timeout').value
  let value = await eel.ping_ip(ip, size, timeout)();
  latency.push(value)
  config.data.datasets[0].data = latency
  window.myLine.update()
  let time
  let avg = 0
  try{
    time = `${value.toFixed(2)}ms`
    avg = latency.reduce((a, b) => a + b, 0)/latency.length
    avg = avg.toFixed(2)
    if(value >= max){
      max = value
    }
    if(min != 0 && min >= value){
      min = value
    }
    else if(min == 0){
      min = value
    }
  }
  catch{
    time = value
    min = min
    max = max
    pingpl++
  }
  var p = document.createElement('DIV')
  p.id = 'ping-count-single'
  var p1 = document.createElement('label')
  p1.innerText = `Bytes: ${size}`
  p1.id = 'inner-ping-count'
  p1.classList.add('ping-size-class');
  var p2 = document.createElement('label')
  p2.innerText = `Host: ${ip}`
  p2.id = 'inner-ping-count'
  p2.classList.add('ping-ip-class');
  p3 = document.createElement('label')
  p3.innerText = `Timeout: ${timeout}ms`
  p3.id = 'inner-ping-count'
  p3.classList.add('ping-timeout-class');
  p4 = document.createElement('label')
  p4.innerText = `Response: ${time}`
  p4.id = 'inner-ping-count'
  p4.classList.add('ping-res-class');
  p.appendChild(p1)
  p.appendChild(p2)
  p.appendChild(p4)
  p.appendChild(p3)
  document.getElementById('ping-counts').appendChild(p)
  document.getElementById('latency-avg').innerText = `Average: ${avg}ms`
  document.getElementById('min').innerText = `Minimum: ${min}ms`
  document.getElementById('max').innerText = `Maximum: ${max}ms`
  document.getElementById('packets-sent').innerText = `Packets Sent: ${c}`
  document.getElementById('packets-lost-ping').innerText = `Packets Loss: ${pingpl}`
  var element = document.getElementById("ping-counts");
  element.scrollTop = element.scrollHeight;
  c++
}

let runPing

function startPing() {
  runPing = setInterval(pingFunc,document.getElementById('timeout').value)
}

function stopPing(){
  clearInterval(runPing)
}

async function exportPing(){
  const size = document.getElementsByClassName('ping-size-class')
  const hosts = document.getElementsByClassName('ping-ip-class')
  const res = document.getElementsByClassName('ping-res-class')
  const timeout = document.getElementsByClassName('ping-timeout-class')
  let dataArr = []
  for (var i = 0; i < size.length; i++) {
    let newArr = []
    newArr.push(size[i].innerText.split(':')[1], hosts[i].innerText.split(':')[1], res[i].innerText.split(':')[1], timeout[i].innerText.split(':')[1])
    dataArr.push(newArr)
  }
  let data = await eel.export_ping(dataArr, hosts[0].innerText.split(':')[1])();
}

function clearPing(){
  const parent = document.getElementById('ping-counts');
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
  config.data.datasets[0].data = []
  window.myLine.update()
  document.getElementById('latency-avg').innerText = ``
  document.getElementById('min').innerText = ``
  document.getElementById('max').innerText = ``
  document.getElementById('packets-sent').innerText = ``
  document.getElementById('packets-lost-ping').innerText = ``
  latency = []
  count = []
  c = 1
  pingpl = 0
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

let tcount = []
let tc = 1
async function captureTraffic(){
  const ip = document.getElementById('ip-add').value
  let traffic = await eel.capture_traffic(ip)();
  tcount.push(tc)
  txRate.push(traffic.rate)
  trafficConfig.data.datasets[0].data = txRate
  window.myLine.update()
  tc++
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

async function startIPScan(){
  range = document.getElementById('ip-range').value
  document.getElementById('spinner').hidden = false
  let results = await eel.ip_scan(range)()
  document.getElementById('spinner').hidden = true
  var displayer = document.getElementById('ip-discovered')
  displayer.hidden = false
  var table = document.getElementById('ip-table')
  var vendorList = []
  var vendorMenu = document.getElementById('vendor-select')
  for (var i = 0; i < results.length; i++) {
    var vendorAdded = false
    var d = document.createElement('tr')
    d.classList.add('vendor-opt');
    d.id = 'inner-ip-scan'
    var ip = document.createElement('th')
    ip.innerText = `${results[i].ip}`
    ip.classList.add('scan-table-ip');
    d.appendChild(ip)
    if(results[i].https_code != 'no HTTPS'){
      var ipAdd = results[i].ip
      let launchBut = document.createElement('button')
      launchBut.style.marginLeft = '10px'
      launchBut.id = 'table-but'
      launchBut.onclick = function(){
        window.open(`https://${ipAdd}`);
      }
      launchBut.innerText = 'Open'
      ip.appendChild(launchBut)
    }
    if(results[i].mac != null){
      var mac = document.createElement('th')
      mac.innerText = `${results[i].mac}`
      mac.classList.add('scan-table-mac');
      var vendor = document.createElement('th')
      vendor.innerText = `${results[i].vendor}`
      vendor.classList.add('scan-table-vendor');
      for (var j=0; j < vendorList.length; j++) {
        if(results[i].vendor == vendorList[j]){
          vendorAdded = true
        }
      }
      if(vendorAdded == false){
        vendorList.push(results[i].vendor)
        var newVen = document.createElement('option')
        newVen.innerText = results[i].vendor
        newVen.value = results[i].vendor
        vendorMenu.appendChild(newVen)
      }
      d.appendChild(mac)
      d.appendChild(vendor)
    }
    table.appendChild(d)
  }
  vendorMenu.onchange = function(event){
    var options = document.getElementsByClassName('vendor-opt')
    for (var i = 0; i < options.length; i++) {
      if(event.target.value != 'all'){
        if(options[i].childNodes[2].innerText == event.target.value){
          options[i].hidden = false
        }else{
          options[i].hidden = true
        }
      }
      else{
        options[i].hidden = false
      }
    }
  }
  document.getElementById('scan-bot-menu').hidden = false
}

async function exportIpScan(){
  const ip = document.getElementsByClassName('scan-table-ip')
  const mac = document.getElementsByClassName('scan-table-mac')
  const vendor = document.getElementsByClassName('scan-table-vendor')
  let dataArr = []
  for (var i = 0; i < ip.length; i++) {
    let newArr = []
    newArr.push(ip[i].innerText)
    try{
      newArr.push(mac[i].innerText, vendor[i].innerText)
    }
    catch{
      newArr.push('','')
    }
    dataArr.push(newArr)
  }
  let data = await eel.export_ip_scan(dataArr)();
}

async function startConnection(){
  const user = document.getElementById('user-connection').value
  const host = document.getElementById('connection-host').value
  let start = await eel.connect(user, host)()
  alert('Connected to '+host)
}


let prs = []
async function floodPing(){
  const host = document.getElementById('fp-host').value
  const timeout = document.getElementById('fp-timeout').value
  const packets = document.getElementById('fp-packets').value
  const size = document.getElementById('fp-size').value
  let rec = 0
  let sent = 0
  document.getElementById('fpp-rec').value = rec
  document.getElementById('fpp-sent').value = sent
  for (var i = 0; i < packets; i++) {
    let ping = await eel.flood_ping(host, timeout, size)()
    sent++
    document.getElementById('fpp-sent').value = sent
    if (ping.res != 'no packets received'){
      rec++
      document.getElementById('fpp-rec').value = rec
    }
    var log = document.createElement('p')
    log.innerText = ping.sum
    log.id = 'each-flood-log'
    document.getElementById('flood-logs').appendChild(log)
  }
  let loss = sent-rec
  prs.push(sent, rec, loss)
  document.getElementById('packet-loss-flood').innerText = `Packet Loss: ${(loss/sent)*100}%`
  var ctx = document.getElementById('myChart').getContext('2d');
  window.myLine = new Chart(ctx, floodGraph);
  document.getElementById('myChart').style.height = '500px';
}

function showLogs(){
  document.getElementById('flood-graph').hidden = true
  document.getElementById('flood-logs').hidden = false
}

async function launchServer(){
  const port = document.getElementById('server-port').value
  let serve = await eel.launch_server(port)();
  alert('hello')
}
