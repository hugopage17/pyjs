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
    document.getElementById('pulse').hidden = false
    document.getElementById('pulse-red').hidden = true
  }
  catch{
    time = value
    min = min
    max = max
    pingpl++
    document.getElementById('pulse').hidden = true
    document.getElementById('pulse-red').hidden = false
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
  document.getElementById('pulse-text').innerText = `Response: ${time}`
  if(value >= (avg*4)){
    var hl = document.createElement('label')
    hl.innerText = 'High Latency'
    hl.style.color = 'rgba(255,0,0)'
    p.appendChild(hl)
  }
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

function alert(){
  document.getElementById('ping-window-graph').hidden = !document.getElementById('ping-window-graph').hidden;
  document.getElementById('pulse-wrapper').hidden = !document.getElementById('pulse-wrapper').hidden;
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

async function wifiAnalysis(){
  let data = await eel.wifi_analysis()();
  document.getElementById('wifi-displayer').innerText = data
  document.getElementById('wifi-graph-wrapper').hidden = true
  document.getElementById('wifi-displayer').hidden = false
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
let traffcGraphType = 'line'
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

function switchWifiGraph(){
  const checker = document.getElementById('traffic-graph-change').checked
  if(checker == true){
    traffcGraphType = 'bar'
  }
  else{
    traffcGraphType = 'line'
  }
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
  if(range != ''){
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
  else{
    Swal.fire({
      icon: 'error',
      title: 'Invalid IP Range',
      text: 'Please enter a valid IP range e.g 192.168.1.1-254'
    })
  }
}

async function arp(){
  let data = await eel.arp_scan()();
  document.getElementById('arp-data').hidden = false
  document.getElementById('arp-data').innerText = data
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
  var checked = document.getElementById('log-check').checked
  if(checked == true){
    document.getElementById('flood-graph').hidden = true
    document.getElementById('flood-logs').hidden = false
  }else if(checked == false){
    document.getElementById('flood-graph').hidden = false
    document.getElementById('flood-logs').hidden = true
  }

}

async function launchServer(){
  const port = document.getElementById('server-port').value
  let serve = await eel.launch_server(port)();
  alert('hello')
}

async function startTrace(){
  document.getElementById('trace-loader').hidden = false
  document.getElementById('trace-res').hidden = true
  const dst = document.getElementById('trace-dst').value
  let trace = await eel.tracert(dst)()
  document.getElementById('trace-res').innerText = trace
  document.getElementById('trace-loader').hidden = true
  document.getElementById('trace-res').hidden = false
}

async function apiRequest(){
  const url = document.getElementById('api-input').value
  const reqType = document.getElementById('api-req-type').value
  var headerKeys = document.getElementsByClassName('header-key-input')
  var headerValues = document.getElementsByClassName('header-value-input')
  const body = document.getElementById('api-res-area').value
  var headers = {}
  for (var i = 0; i < headerKeys.length; i++) {
    const key = headerKeys[i].value
    headers[key] = headerValues[i].value
  }
  let req = await eel.api_req(url, reqType, headers, body)();
  document.getElementById('api-res').innerText = req.res
  document.getElementById('res-code').innerText = `Status Code: ${req.code}`
  document.getElementById('res-time').innerText = `Response Time: ${req.time}`
}

async function apiHistory(){
  document.getElementById('api-wrapper').hidden = !document.getElementById('api-wrapper').hidden
}

function addHeader(){
  var key = document.createElement('input')
  key.classList.add('header-key-input')
  key.style.width = '33%'
  key.placeholder = 'Key'
  var value = document.createElement('input')
  value.classList.add('header-value-input')
  value.style.width = '33%'
  value.placeholder = 'Value'
  var checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.classList.add('api-header-checkbox')
  checkbox.checked = true
  var but = document.createElement('button')
  but.classList.add('close-but')
  but.innerText = 'x'
  document.getElementById('header-menu').appendChild(checkbox)
  document.getElementById('header-menu').appendChild(key)
  document.getElementById('header-menu').appendChild(value)
  document.getElementById('header-menu').appendChild(but)
  document.getElementById('header-menu').appendChild(document.createElement('br'))
}

async function apiSave(){
  const url = document.getElementById('api-input').value
  const reqType = document.getElementById('api-req-type').value
  const code = document.getElementById('res-code').innerText
  var headerKeys = document.getElementsByClassName('header-key-input')
  var headerValues = document.getElementsByClassName('header-value-input')
  const body = document.getElementById('api-res-area').value
  var headers = {}
  for (var i = 0; i < headerKeys.length; i++) {
    const key = headerKeys[i].value
    headers[key] = headerValues[i].value
  }
  let save = await eel.api_save(url, reqType, code, headers, body)();
}
