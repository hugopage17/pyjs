var sidebarItems = [
  {
    name:'Ping',
    file:'ping.txt',
    img:'images/ping.png',
    domName:'ping-test',
    opened:false
  },
  {
    name:'Traceroute',
    file:'trace.txt',
    domName:'trace',
    img:'images/traceroute.png',
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
    name:'Throughput',
    file:'traffic.txt',
    domName:'traffic-capture',
    img:'images/bandwidth.png',
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
    name:'HTTP API',
    file:'api.txt',
    domName:'api-test',
    img:'images/api.png',
    opened:false
  },
  {
    name:'Connection',
    file:'connection.txt',
    domName:'connection',
    img:'images/connection.png',
    opened:false
  },
  {
    name:'Flood Ping',
    file:'flood-ping.txt',
    domName:'flood-ping',
    img:'images/flood.png',
    opened:false
  },
  {
    name:'Web Server',
    file:'server.txt',
    opened:false,
    domName:'server',
    img:'images/server.png',
    opened:false
  },
  {
    name:'NIC',
    file:'nic.txt',
    domName:'nic',
    img:'images/port.png',
    opened:false
  },
  {
    name:'Account',
    file:'settings.txt',
    domName:'settings',
    opened:false,
    img:'images/account.png'
  }
]

let windows_opened = 0
let nicData

window.onload = async function(){
    var online = navigator.onLine;
    if(online == false){
      Swal.fire({
        icon: 'warning',
        title: 'No Connection',
        background:'#4d4d4d',
        text: 'You are not connected to the internet'
      })
    }
    const p = new Promise((res, rej) => {
      setTimeout(()=>{
        res(firebase.auth().currentUser.displayName)
      },1000)
    })
    p.then((user)=>{
      document.getElementById('user').innerText = `Welcome ${user}`
    })
  let nic = await eel.get_nic()()
  nicData = nic
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
      document.getElementById('first-window').hidden = true
      if(item.opened == false){
        let value = await eel.get_html(file)();
        var doc = new DOMParser().parseFromString(value, "text/html");
        html = doc.documentElement
        document.getElementById('main-panel').appendChild(html)
        item.opened = true
        windows_opened++
      }
      let ctx
      if(item.name == 'Ping'){
        firebase.database().ref(firebase.auth().currentUser.uid+'/pingHistory').once('value').then((snap)=>{
          const data = snap.val()
          Object.keys(data).map((key, index) => {
            const add = data[key]
            Object.keys(add).map((key, index) => {
              var opt = document.createElement('option')
              opt.value = add[key]
              document.getElementById('ping-hist').appendChild(opt)
            })
          })
        })
        ctx = document.getElementById('myChart').getContext('2d');
        window.myLine = new Chart(ctx, config);
      }else if(item.name == 'Wifi Scan'){
        ctx = document.getElementById('myScanChart').getContext('2d');
        window.myLine = new Chart(ctx, barConfig);
      }
      else if(item.name == 'Throughput'){
        ctx = document.getElementById('myTrafficChart').getContext('2d');
        window.myLine = new Chart(ctx, trafficConfig);
      }
      else if(item.name == 'NIC'){
        for (var i = 0; i < nicData.length; i++) {
          var eachDiv = document.createElement('div')
          var name = document.createElement('h1')
          name.innerText = nicData[i].name
          eachDiv.appendChild(name)
          document.getElementById('nic-div').appendChild(eachDiv)
        }
      }
      else if (item.name == 'HTTP API'){
        firebase.database().ref(firebase.auth().currentUser.uid+'/apiHistory').once('value', function(snap){
          var data = snap.val()
          Object.keys(data).map((key, index) => {
            const api = data[key]
            var div = document.createElement('div')
            div.id = 'each-api-his'
            var urlP = document.createElement('p')
            urlP.innerText = api.url
            urlP.classList.add('api-hist-url')
            var typeP = document.createElement('p')
            typeP.innerText = api.reqType
            typeP.classList.add('api-hist-type')
            var codeP = document.createElement('p')
            codeP.innerText = `Status Code: ${api.code}`
            codeP.classList.add('api-hist-code')
            var openBut = document.createElement('button')
            openBut.innerText = 'Open'
            openBut.classList.add('panel-but')
            openBut.style.float = 'right'
            if(api.reqType == 'get'){
              typeP.style.color = 'rgba(0,255,0)'
              typeP.style.border = '1px solid rgba(0,255,0)'
            }
            else if(api.reqType == 'delete'){
              typeP.style.color = 'rgba(255,0,0)'
              typeP.style.border = '1px solid rgba(255,0,0)'
            }
            div.appendChild(codeP)
            div.appendChild(urlP)
            div.appendChild(typeP)
            div.appendChild(openBut)
            document.getElementById('api-his-inner').appendChild(div)
          })
        })
        firebase.database().ref(firebase.auth().currentUser.uid+'/apiSaved').once('value', function(snap){
          var data = snap.val()
          Object.keys(data).map((key, index) => {
            const api = data[key]
            var div = document.createElement('div')
            div.id = 'each-api-his'
            var urlP = document.createElement('p')
            urlP.innerText = api.url
            urlP.classList.add('api-hist-url')
            var typeP = document.createElement('p')
            typeP.innerText = api.type
            typeP.classList.add('api-hist-type')
            var codeP = document.createElement('p')
            codeP.innerText = `${api.name}`
            codeP.classList.add('api-hist-code')
            var openBut = document.createElement('button')
            openBut.innerText = 'Open'
            openBut.classList.add('panel-but')
            openBut.style.float = 'right'
            if(api.type == 'get'){
              typeP.style.color = 'rgba(0,255,0)'
              typeP.style.border = '1px solid rgba(0,255,0)'
            }
            else if(api.type == 'delete'){
              typeP.style.color = 'rgba(255,0,0)'
              typeP.style.border = '1px solid rgba(255,0,0)'
            }
            div.appendChild(codeP)
            div.appendChild(urlP)
            div.appendChild(typeP)
            div.appendChild(openBut)
            document.getElementById('api-saved-inner').appendChild(div)
          })
        })
      }
      else if (item.name == 'Account'){
        firebase.database().ref(firebase.auth().currentUser.uid).once('value').then((snap)=>{
          const details = snap.val()
          document.getElementById('email-tag').innerText = `Email: ${firebase.auth().currentUser.email}`
          document.getElementById('uid').innerText = `${firebase.auth().currentUser.uid}`
          document.getElementById('license').innerText = `${details.licenseKey}`
          document.getElementById('join-date').innerText = `Account Created: ${firebase.auth().currentUser.metadata.creationTime}`
        })
      }
      else if (item.name == 'Connection'){
        firebase.database().ref(firebase.auth().currentUser.uid+'/connSessions').once('value').then((snap)=>{
          const data = snap.val()
          if (data != 0){
            document.getElementById('saved-conn-sess').hidden = false
          }
        })
      }
      for (var i = 0; i < document.getElementsByTagName("canvas").length; i++){
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
