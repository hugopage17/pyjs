async function getTime() {
  let num = document.getElementById('name').value
  let value = await eel.getTime(num)();
  alert(value);
}
