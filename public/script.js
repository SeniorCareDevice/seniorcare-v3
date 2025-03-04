let tempGauge, heartRateGauge, spo2Gauge, map, marker;

// Initialize gauges
document.addEventListener('DOMContentLoaded', () => {
  tempGauge = new JustGage({
    id: 'tempGauge',
    value: 0,
    min: -20,
    max: 50,
    title: 'Temperature (°C)',
    label: '°C'
  });
  heartRateGauge = new JustGage({
    id: 'heartRateGauge',
    value: 0,
    min: 0,
    max: 200,
    title: 'Heart Rate',
    label: 'BPM'
  });
  spo2Gauge = new JustGage({
    id: 'spo2Gauge',
    value: 0,
    min: 0,
    max: 100,
    title: 'SpO2',
    label: '%'
  });

  // Initialize map
  map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  marker = L.marker([0, 0]).addTo(map);

  // Fetch data and update
  fetchData();
  setInterval(fetchData, 2000); // Update gauges every 2 seconds
  setInterval(updateMap, 60000); // Update map every 1 minute

  // Restart map button
  document.getElementById('restartMap').addEventListener('click', updateMap);
});

function fetchData() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      tempGauge.refresh(data.temperature !== "N/A" ? data.temperature : 0);
      heartRateGauge.refresh(data.heartRate !== "N/A" ? data.heartRate : 0);
      spo2Gauge.refresh(data.spo2 !== "N/A" ? data.spo2 : 0);
      document.getElementById('fallStatus').textContent = data.fallDetected ? 'Yes' : 'No';
      document.getElementById('satellites').textContent = data.satellites;
    })
    .catch(error => console.error('Error fetching data:', error));
}

function updateMap() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      if (data.latitude !== "N/A" && data.longitude !== "N/A") {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        map.setView([lat, lng], 13);
        marker.setLatLng([lat, lng]);
      }
    });
}