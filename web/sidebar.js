async function render() {
  let value = await eel.getHtml("ping.txt")();
  var doc = new DOMParser().parseFromString(value, "text/xml");
  html = doc.documentElement
  console.log(html);
  document.getElementById('main-panel').appendChild(html)
}
