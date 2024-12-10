document.addEventListener('DOMContentLoaded', function () {
    fetch('/earthquakes').then(response => response.json()).then(data => {
        // BAR CHART - Magnitude classifications
        const classification_labels = data.classification.map(row => row.classification);
        const classification_counts = data.classification.map(row => row.count);

        // Create the chart with fetched data
        const ctb = document.getElementById('magnitudBar');
        const magnitudBar = new Chart(ctb, {
            type: 'bar',
            data: {
                labels: classification_labels,
                datasets: [{
                    label: 'Earthquake Classifications',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    data: classification_counts,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                indexAxis: 'x',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of earthquakes',
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Seismic Classification',
                        }
                    }
                }
            }
        });

        // PIE CHART - Magnitude percentages
        const classification_labels_pecentage = data.classificationPercentage.map(row => row.classification);
        const classification_percentage = data.classificationPercentage.map(row => row.percentage);

        const ctp = document.getElementById('magnitudPie');
        const magnitudPie = new Chart(ctp, {
            type: 'doughnut',
            data: {
                labels: classification_labels_pecentage,
                datasets: [{
                    label: 'Magnitude distribution (%)',
                    //data: classification_labels_pecentage,
                    backgroundColor: [
                        'red',
                        'blue',
                        'yellow',
                        'green',
                        'purple',
                        'orange',
                    ],
                    data: classification_percentage,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });

        // SCATTER CHART - Magnitude classifications
        const counter_depth = data.seismicScatter.map(row => row.depth);
        const counter_magnitud = data.seismicScatter.map(row => row.magnitud);

        // Create the chart with fetched data
        const cts = document.getElementById('magnitudDepthScatter');
        const magnitudDepthScatter = new Chart(cts, {
            type: 'scatter',
            data: {
                labels: counter_depth,
                datasets: [{
                    label: 'Earthquake Classifications',
                    backgroundColor: 'rgba(62, 242, 27, 0.5)',
                    //borderColor: 'rgba(54, 162, 235, 1)',
                    data: counter_magnitud,
                    //borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Depth (kilometers)',
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Magnitude',
                        }
                    }
                }
            }
        });

        // LINE CHART - Magnitude classifications
        const earthquakes_magnitud = data.countByMagnitud.map(row => row.magnitud);
        const earthquakes_counts = data.countByMagnitud.map(row => row.count);

        // Create the chart with fetched data
        const cta = document.getElementById('magnitudDepthBar');
        const magnitudDepthBar = new Chart(cta, {
            type: 'line',
            data: {
                labels: earthquakes_magnitud,
                datasets: [{
                    label: 'Earthquake Classifications',
                    backgroundColor: 'rgba(237, 136, 21, 0.2)',
                    borderColor: 'rgba(237, 136, 21, 1)',
                    data: earthquakes_counts,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                indexAxis: 'y',
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Number of earthquakes',
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Seismic Classification',
                        }
                    }
                }
            }
        });
    }).catch(error => console.error('Erro ao carregar os dados:', error));
});
