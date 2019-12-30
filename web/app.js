let latency = []
let count = []
var c = 1
var config = {
    type: 'line',
    data: {
        labels: count,
        datasets: [{
            label: 'Latency ms',
            data: latency,
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}
window.onload = async function() {
  let user = await eel.get_user()();
  document.getElementById('user').innerText = `Welcome ${user}`
  var ctx = document.getElementById('myChart').getContext('2d');
  window.myLine = new Chart(ctx, config);
}
function connect() {
  setInterval(async function(){
    count.push(c)
    c++
    let ip = document.getElementById('name').value
    let value = await eel.ping_ip(ip)();
    latency.push(value)
    config.data.datasets[0].data = latency
    window.myLine.update()
    let avg = latency.reduce((a, b) => a + b, 0)/latency.length
    avg = avg.toFixed(2)
    let time = value.toFixed(2)
    document.getElementById('current-ping').innerText = `Time = ${time}ms`
    document.getElementById('latency-avg').innerText = `Average = ${avg}ms`
  },1000)
}
