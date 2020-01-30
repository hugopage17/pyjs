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
                },
                scaleLabel:{
                  display:true,
                  labelString:'response time (ms)'
                }
            }]
        },
        maintainAspectRatio: false
    }
}

var barConfig = {
    type: 'bar',
    data: {
        labels: ssids,
        datasets: [{
            label: 'Signal Strength',
            data: signals,
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
                },
                scaleLabel:{
                  display:true,
                  labelString:'signal strength (%)'
                }
            }]
        },
        maintainAspectRatio: false
    }
}

var trafficConfig = {
    type: traffcGraphType,
    data: {
        labels: tcount,
        datasets: [{
            label: 'TX Rate (kbs)',
            data: txRate,
            fill: true,
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
                },
                scaleLabel:{
                  display:true,
                  labelString:'throughput (kbs)'
                }
            }]
        },
        maintainAspectRatio: false
    }
}

var floodGraph = {
  type: 'bar',
  data: {
      labels: ['Packets Sent', 'Packets Received', 'Packets Lost'],
      datasets: [{
          label: 'Results',
          data: prs,
          fill: false,
          backgroundColor: ['rgba(54, 162, 235, 0.2)','rgba(54, 162, 235, 0.2)','rgba(196, 0, 46, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)','rgba(54, 162, 235, 1)','rgba(196, 0, 46, 1)'],
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
      },
      maintainAspectRatio: false
  }
}
