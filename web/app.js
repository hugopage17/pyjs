async function getTime() {
  let num = document.getElementById('name').value
  let value = await eel.runTime(num)();
  document.getElementById('content').value = `${num} x 2 = ${value}`
}
