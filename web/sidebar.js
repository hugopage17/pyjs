window.onload = async function pingIt(){
  let value = await eel.getHtml("ping.txt")();
  var doc = new DOMParser().parseFromString(value, "text/html");
  html = doc.documentElement
  console.log(html);
  document.getElementById('main-panel').appendChild(html)
  var ctx = document.getElementById('myChart').getContext('2d');
  window.myLine = new Chart(ctx, config);
}
