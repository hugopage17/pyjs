var sidebarItems = [
  {
    name:'Ping',
    file:'ping.txt',
    img:'images/ping.png'
  },
  {
    name: 'Wifi Scan',
    file:'wifi.txt',
    img:'images/wifi.png'
  },
  {
    name:'Local Server',
    file:'server.txt'
  },
  {
    name:'Traffic',
    file:'traffic.txt'
  },
  {
    name:'IP Scan',
    file:'ipScan.txt',
    img:'images/ip-scan.png'
  },
  {
    name:'Connection',
    file:'connection.txt'
  },
  {
    name:'Flood Ping',
    file:'flood-ping.txt'
  }
]

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
      let value = await eel.get_html(file)();
      var doc = new DOMParser().parseFromString(value, "text/html");
      html = doc.documentElement
      document.getElementById('main-panel').appendChild(html)
      var ctx = document.getElementById('myChart').getContext('2d');
      if(item.name == 'Ping'){
        window.myLine = new Chart(ctx, config);
      }else if(item.name == 'Wifi Scan'){
        window.myLine = new Chart(ctx, barConfig);
      }
      else if(item.name == 'Traffic'){
        window.myLine = new Chart(ctx, trafficConfig);
      }
      document.getElementById('myChart').style.height = '500px';
    }
  })
}
