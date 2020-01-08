var sidebarItems = [
  {
    name:'Ping',
    file:'ping.txt',
    img:'images/ping.png',
    domName:'ping-test',
    opened:false
  },
  {
    name: 'Wifi Scan',
    file:'wifi.txt',
    img:'images/wifi.png',
    domName:'wifi-scan',
    opened:false
  },
  {
    name:'Local Server',
    file:'server.txt',
    opened:false
  },
  {
    name:'Traffic',
    file:'traffic.txt',
    domName:'traffic-capture',
    opened:false
  },
  {
    name:'IP Scan',
    file:'ipScan.txt',
    img:'images/ip-scan.png',
    domName:'ip-scan',
    opened:false
  },
  {
    name:'Connection',
    file:'connection.txt',
    opened:false
  },
  {
    name:'Flood Ping',
    file:'flood-ping.txt',
    domName:'flood-ping',
    opened:false
  }
]

let windows_opened = 0

window.onload = async function(){
    var online = navigator.onLine;
    if(online == false){
      Swal.fire({
        icon: 'warning',
        title: 'No Connection',
        text: 'You are not connected to the network',
        footer: '<a href>Why do I have this issue?</a>'
      })
    }
  let user = await eel.get_user()();
  document.getElementById('user').innerText = `Welcome ${user}`
  sidebarItems.map((item)=>{
    var i = document.createElement('label')
    var img = document.createElement('img')
    var eachIcon = document.createElement('div')
    eachIcon.id = 'each-icon'
    img.src = item.img
    img.id = 'side-icon'
    i.id = 'side-label'
    i.innerText = item.name
    eachIcon.appendChild(img)
    eachIcon.appendChild(i)
    document.getElementById('sidebar').appendChild(eachIcon)
    const file = item.file
    eachIcon.onclick = async function(){
      if(item.opened == false){
        let value = await eel.get_html(file)();
        var doc = new DOMParser().parseFromString(value, "text/html");
        html = doc.documentElement
        document.getElementById('main-panel').appendChild(html)
        item.opened = true
        windows_opened++
      }
      let ctx = document.getElementById('myChart').getContext('2d');
      if(item.name == 'Ping'){
        ctx = document.getElementById('myChart').getContext('2d');
        window.myLine = new Chart(ctx, config);
      }else if(item.name == 'Wifi Scan'){
        ctx = document.getElementById('myScanChart').getContext('2d');
        window.myLine = new Chart(ctx, barConfig);
      }
      else if(item.name == 'Traffic'){
        window.myLine = new Chart(ctx, trafficConfig);
      }
      for (var i = 0; i < document.getElementsByTagName("canvas").length; i++) {
        document.getElementsByTagName("canvas")[i].style.height = '500px';
      }
      if(windows_opened != 0){
        var panels = document.getElementsByClassName('panel-wrapper')
        for (var i = 0; i < panels.length; i++) {
          const name = panels[i].getAttribute("name")
          if(name != item.domName){
            panels[i].hidden = true
          }else{
            panels[i].hidden = false
          }
        }
      }
    }
  })
}
