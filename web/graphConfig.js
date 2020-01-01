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
                }
            }]
        },
        maintainAspectRatio: false
    }
}

var trafficConfig = {
    type: 'line',
    data: {
        labels: count,
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
                }
            }]
        },
        maintainAspectRatio: false
    }
}
