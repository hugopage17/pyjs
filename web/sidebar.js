var sidebarItems = [
  {
    name:'ping',
    file:'ping.txt'
  }
]

window.onload = async function(){
  let user = await eel.get_user()();
  document.getElementById('user').innerText = `Welcome ${user}`
  sidebarItems.map((item)=>{
    var i = document.createElement('p')
    i.innerText = item.name
    document.getElementById('sidebar').appendChild(i)
    const file = item.file
    i.onclick = async function(){
      let value = await eel.get_html(file)();
      var doc = new DOMParser().parseFromString(value, "text/html");
      html = doc.documentElement
      document.getElementById('main-panel').appendChild(html)
      var ctx = document.getElementById('myChart').getContext('2d');
      window.myLine = new Chart(ctx, config);
      document.getElementById('myChart').style.height = '500px';
    }
  })
}
